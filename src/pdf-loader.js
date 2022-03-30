(function (global) {

    var pdfLinks = global.document.querySelectorAll("[data-download]");
    for (var i = 0; i < pdfLinks.length; i++) {
        if (pdfLinks[i].getAttribute("data-download") === "pdf") {
            pdfLinks[i].onclick = function (event) {

                var self = this;

                event.preventDefault();

                global.document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", "<div class=\"pdf-load\" style=\"position: fixed; top : 0; bottom : 0; left : 0; right : 0; background-color : rgba(0,0,100,0.3);\"></div>");
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", self.getAttribute("href"));
                xmlhttp.responseType = 'blob';
                xmlhttp.onload = function () {
                    if (xmlhttp.status === 200) {
                        var blob = new Blob([xmlhttp.response], { type: 'image/pdf' });

                        let a = document.createElement("a");
                        a.style = "display: none";
                        document.body.appendChild(a);

                        let url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = isValidFileName(self.download) ? self.download : new Date().toLocaleString().replace(', ', '_').replace(/[^a-zA-Z0-9\_]/g, '-') + '.pdf';

                        a.click();
                        //release the reference to the file by revoking the Object URL
                        window.URL.revokeObjectURL(url);

                        // ALTERNATIV FOLGENDE VARIANTE UMSETZEN:

                        /*
                         * Kleinen Dialog öffnen: "Einen Moment... Ihr PDF wird generiert." wird ersetzt durch "Ihr PDF steht jetzt zum Download zur verfügung."
                         * [Herunterladen] [Abbrechen]
                         * 
                         * Dafür muss window.URL.revokeObjectURL(url); später aufgerufen werden (wenn das Dialogfeld geschlossen wurde/das PDF abgerufen wurde).
                         */

                        global.document.getElementsByClassName("pdf-load")[0].remove();
                    }
                };
                xmlhttp.send();
            };
            
        }
    }

    function isValidFileName(filename) {
        return filename && typeof filename === 'string' && filename.match(/^[0-9a-zA-Z\-\_]+\.[a-zA-Z]+$/);
    }

}(window));