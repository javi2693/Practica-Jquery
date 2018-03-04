// Datapicker
$(function () {
    var dateFormat = "mm/dd/yy",
        from = $("#from")
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }
});

// Datapicker en español
(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["../widgets/datepicker"], factory);
    } else {

        // Browser globals
        factory(jQuery.datepicker);
    }
}(function (datepicker) {

    datepicker.regional.es = {
        closeText: "Cerrar",
        prevText: "&#x3C;Ant",
        nextText: "Sig&#x3E;",
        currentText: "Hoy",
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthNamesShort: ["Ene", "Feb", "Mar", "abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dayNames: ["domingo", "lunes", "Martes", "miércoles", "jueves", "viernes", "sábado"],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
        weekHeader: "Sm",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ""
    };
    datepicker.setDefaults(datepicker.regional.es);

    return datepicker.regional.es;

}));



// Efectos
$(function () {
    // run the currently selected effect
    function runEffect() {
        // get effect type from
        var selectedEffect = $("#effectTypes").val();

        // Most effect types need no options passed by default
        var options = {};
        // some effects have required parameters
        if (selectedEffect === "scale") {
            options = { percent: 50 };
        } else if (selectedEffect === "size") {
            options = { to: { width: 280, height: 185 } };
        }

        // Run the effect
        $("#effect").show(selectedEffect, options, 500, callback);
    };

    //callback function to bring a hidden box back
    function callback() {
        setTimeout(function () {
            $("#effect:visible").removeAttr("style").fadeOut();
        }, 1000);
    };

    // Set effect from select menu value
    $("#button").on("click", function () {
        runEffect();
    });

    $("#effect").hide();
});

$(function () {
    var progressTimer,
        progressbar = $("#progressbar"),
        progressLabel = $(".progress-label"),
        dialogButtons = [{
            text: "Cancelar descarga",
            click: closeDownload
        }],
        dialog = $("#dialog").dialog({
            autoOpen: false,
            closeOnEscape: false,
            resizable: false,
            buttons: dialogButtons,
            open: function () {
                progressTimer = setTimeout(progress, 2000);
            },
            beforeClose: function () {
                downloadButton.button("option", {
                    disabled: false,
                    label: "Iniciar descarga"
                });
            }
        }),
        downloadButton = $("#downloadButton")
            .button()
            .on("click", function () {
                $(this).button("option", {
                    disabled: true,
                    label: "Descargando"
                });
                dialog.dialog("open");
            });

    progressbar.progressbar({
        value: false,
        change: function () {
            progressLabel.text("Progreso: " + progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("Completado");
            dialog.dialog("option", "buttons", [{
                text: "Cerrar",
                click: closeDownload
            }]);
            $(".ui-dialog button").last().trigger("focus");
        }
    });

    function progress() {
        var val = progressbar.progressbar("value") || 0;

        progressbar.progressbar("value", val + Math.floor(Math.random() * 3));

        if (val <= 99) {
            progressTimer = setTimeout(progress, 50);
        }
    }

    function closeDownload() {
        clearTimeout(progressTimer);
        dialog
            .dialog("option", "buttons", dialogButtons)
            .dialog("close");
        progressbar.progressbar("value", false);
        progressLabel
            .text("Iniciando descarga");
        downloadButton.trigger("focus");
    }
});

// Formulario
$(function () {
    var dialog, form,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=Apellidos%29
        Nombre = $("#Nombre"),
        Apellidos = $("#Apellidos"),
        Marca = $("#Marca"),
        Modelo = $("#Modelo"),
        Matricula = $("#Matricula"),
        allFields = $([]).add(Nombre).add(Apellidos).add(Marca).add(Modelo).add(Matricula),
        tips = $(".validateTips");

    function updateTips(t) {
        tips
            .text(t)
            .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("La longitud de " + n + " debe estar entre " +
                min + " y " + max + " caracteres.");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    function addUser() {
        var valid = true;
        allFields.removeClass("ui-state-error");

        valid = valid && checkLength(Nombre, "Nombre", 3, 16);
        valid = valid && checkLength(Apellidos, "Apellidos", 6, 80);
        valid = valid && checkLength(Marca, "Marca", 5, 16);
        valid = valid && checkLength(Modelo, "Modelo", 5, 25);
        valid = valid && checkLength(Matricula, "Matricula", 5, 10);

        valid = valid && checkRegexp(Nombre, /^[a-z]([0-9a-z_\s])+$/i, "Nombre may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(Apellidos, /^[a-z]([0-9a-z_\s])+$/i, "Apellidos may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(Marca, /^[a-z]([0-9a-z_\s])+$/i, "Marca may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(Modelo, /^[a-z]([0-9a-z_\s])+$/i, "Modelo may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(Matricula, /^[a-z]([0-9a-z_\s])+$/i, "Matricula may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");



        if (valid) {
            $("#users tbody").append("<tr>" +
                "<td>" + Nombre.val() + "</td>" +
                "<td>" + Apellidos.val() + "</td>" +
                "<td>" + Marca.val() + "</td>" +
                "<td>" + Modelo.val() + "</td>" +
                "<td>" + Matricula.val() + "</td>" +
                "</tr>");
            dialog.dialog("close");
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Registrarse": addUser,
            Cancelar: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addUser();
    });

    $("#create-user").button().on("click", function () {
        dialog.dialog("open");
    });
});