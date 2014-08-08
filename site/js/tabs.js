
var render_tabs = function render_tabs() {

    var tabs= [ {"name": "Diabetes", "pathname": "/diabetes.html"},
                {"name": "Toothpick", "pathname": "/toothpick.html"} ];

    var add_click = function add_click(name, pathname) {
        $('#' + name).click(function (e) {
            window.location.pathname = pathname;
        });
    };

    var container = $('#project-tabs');

    for (i = 0; i < tabs.length; i++) {
        var name = tabs[i]['name'];
        var pathname = tabs[i]['pathname'];

        var clazz= (window.location.pathname == pathname) ? "active" : "inactive";

        container.append('<li class="' + clazz + '">' +
                         '<a href="#" role="tab" data-toggle="tab" id="' + name + '">'
                         + name +
                         '</a></li>');

        add_click(name, pathname);

    };

};
