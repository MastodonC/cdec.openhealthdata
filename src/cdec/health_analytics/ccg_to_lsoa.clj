(ns cdec.health-analytics.ccg-to-lsoa
  "Basic query to load the ccg to lsoa mapping. This allows us to join ONS data with NHS data. There are multiple LSOAs per CCG but each LSOA maps to a single CCG."
  (:require [cascalog.api :refer :all]
            [cascalog.ops :as ops]
            [cascalog.tap :as tap]
            [clojure.tools.logging :refer [infof errorf]]
            [cascalog.more-taps :refer [hfs-delimited]]))

#_(use 'cascalog.playground)
#_(bootstrap-emacs)

;; Data Source
;; http://www.england.nhs.uk/resources/ccg-directory/

;; What are SOAs
;; http://www.neighbourhood.statistics.gov.uk/dissemination/Info.do?page=aboutneighbourhood/geography/superoutputareas/soa-intro.htm

(defn ccg-lsoa [in]
  (<- [?lsoa11cd ?lsoa11nm ?ccgcode ?ccgname]
      (in :> ?lsoa11cd ?lsoa11nm ?ccgcode ?ccgname)))

#_(?- (hfs-delimited "./output/ccg-lsoa" :sinkmode :replace)
      (ccg-lsoa (hfs-delimited "./input/ccg-lsoa" :delimiter "," :skip-header? true)))
