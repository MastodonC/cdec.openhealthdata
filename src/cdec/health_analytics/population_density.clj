(ns cdec.health-analytics.population-density
  "Population density from ONS 2011 Census"
  (:require [cascalog.api :refer :all]
            [cascalog.ops :as ops]
            [cascalog.tap :as tap]
            [clojure.data.csv :as csv]
            [clojure.tools.logging :refer [infof errorf]]
            [cascalog.more-taps :refer [hfs-delimited]]
            [cdec.health-analytics.ccg-to-lsoa :as lsoa]
            [cdec.conversions :as conv]))

#_(use 'cascalog.playground)
#_(bootstrap-emacs)

;; ?gor_code ?gor_name ?la_code ?la_name ?msoa_code ?msoa_name ?lsoa_code ?lsoa_name ?area_metadata ?blank ?population ?area ?density

;; If the 3rd column starts with E or W then it is data.
(defn data-line? [line]
  (let [[fields] (csv/read-csv line)
        la-code (nth fields 2)]
    (or (.startsWith la-code "W")
        (.startsWith la-code "E"))))

(defn split-line [line]
  (first (csv/read-csv line)))

(defn population-density [in]
  (<- [?la_code ?la_name ?msoa_code ?msoa_name ?lsoa_code
       ?lsoa_name ?area_metadata ?population ?area ?density]
      (in :> ?line)
      (data-line? ?line)
      (split-line ?line
                  :> _ _ ?la_code ?la_name ?msoa_code ?msoa_name
                  ?lsoa_code ?lsoa_name ?area_metadata _
                  ?population_dirty ?area_dirty ?density_dirty)
      (conv/numbers-as-strings? ?population_dirty ?area_dirty ?density_dirty)
      (conv/parse-double ?population_dirty :> ?population)
      (conv/parse-double ?area_dirty :> ?area)
      (conv/parse-double ?density_dirty :> ?density)))

#_(?- (hfs-delimited "./output/population-density" :sinkmode :replace)
      (population-density (hfs-textline "./input/population-density")))

(defn population-density-ccg [pop-density ccg-lsoa]
  (<- [?ccgcode ?total_population ?total_area ?density]
      (pop-density :#> 10 {4 ?lsoa_code
                           7 ?population
                           8 ?area})
      (ccg-lsoa :#> 4 {0 ?lsoa_code
                       2 ?ccgcode})
      (ops/sum ?population :> ?total_population)
      (ops/sum ?area :> ?total_area)
      (div ?total_population ?total_area :> ?density)
      ))

#_(?- (hfs-delimited "./output/ccg-density" :sinkmode :replace)
      (population-density-ccg
       (population-density (hfs-textline "./input/population-density"))
       (lsoa/ccg-lsoa (hfs-delimited "./input/ccg-lsoa" :delimiter "," :skip-header? true))))



