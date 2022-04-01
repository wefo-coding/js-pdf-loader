(function (global) {
    
    var url;
    var pdfLinks = global.document.querySelectorAll("[data-download]");
    
    for (var i = 0; i < pdfLinks.length; i++) {
        if (pdfLinks[i].getAttribute("data-download") === "pdf") {
            pdfLinks[i].onclick = function (event) {

                var self = this;

                event.preventDefault();

                let dialog = document.getElementsByTagName("body")[0].appendChild(getDialog());
                dialog.onclick = function(e){
                    if(e.target === this){
                        closeDialog();
                    }
                };
                
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", self.getAttribute("href"));
                xmlhttp.responseType = 'blob';
                xmlhttp.onload = function () {
                    if (xmlhttp.status === 200) {
                        
                        document.getElementById('pdf-load').classList.add('done');
                        
                        var blob = new Blob([xmlhttp.response], { type: 'image/pdf' });

                        let a = document.getElementById('pdf-download');

                        url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = isValidFileName(self.download) ? self.download : new Date().toLocaleString().replace(', ', '_').replace(/[^a-zA-Z0-9\_]/g, '-') + '.pdf';
                        
                        a.onclick = function(){
                            setTimeout(closeDialog, 1000); // Theoretisch reicht 1 ms. Wichtig ist, dass closeDialog() erst ausgeführt wird, wenn das onclick event beendet bzw. der Download gestartet wurde.
                        };
                        
                        document.getElementById('pdf-cancel').onclick = closeDialog;
                    }
                    else{
                        closeDialog();
                    }
                };
                xmlhttp.send();
            };
            
        }
    }

    function isValidFileName(filename) {
        return filename && typeof filename === 'string' && filename.match(/^[0-9a-zA-Z\-\_]+\.[a-zA-Z]+$/);
    }
    
    function getDialog(){
        var pdfLoad = document.createElement('div');
        pdfLoad.setAttribute('id', 'pdf-load');
        
        var dialog = document.createElement('div');
        dialog.classList.add('pdf-load-dialog');
        pdfLoad.appendChild(dialog);
        
        var icon = document.createElement('div');
        icon.classList.add('icon');
        dialog.appendChild(icon);
        
        var iconLoading = document.createElement('div');
        iconLoading.classList.add('loading');
        icon.appendChild(iconLoading);
        
        var iconDone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconDone.classList.add('done');
        iconDone.setAttribute('viewBox', "0 0 24 24");
        iconDone.setAttribute('width', "60px");
        iconDone.setAttribute('height', "60px");
        iconDone.setAttribute('fill', "#22CC33");
        icon.appendChild(iconDone);
        
        var iconDonePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconDonePath.setAttribute('d', "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z");
        iconDone.appendChild(iconDonePath);
        
        var message = document.createElement('div');
        message.classList.add('message');
        dialog.appendChild(message);
        
        var messageLoading = document.createElement('p');
        messageLoading.classList.add('loading');
        messageLoading.innerHTML = "Einen Moment bitte...<br>Ihr PDF wird generiert.";
        message.appendChild(messageLoading);
        
        var messageDone = document.createElement('p');
        messageDone.classList.add('done');
        messageDone.innerHTML = "Ihr PDF steht jetzt zum Download zur Verfügung.";
        message.appendChild(messageDone);
        
        var buttons = document.createElement('div');
        buttons.classList.add('buttons');
        dialog.appendChild(buttons);
        
        var buttonLoading = document.createElement('a');
        buttonLoading.setAttribute('id', 'pdf-cancel');
        buttonLoading.textContent = "Cancel";
        buttonLoading.setAttribute('href', "#");
        buttons.appendChild(buttonLoading);
        
        var buttonDone = document.createElement('a');
        buttonDone.setAttribute('id', 'pdf-download');
        buttonDone.classList.add('done');
        buttonDone.textContent = "Download";
        buttons.appendChild(buttonDone);
        
        return pdfLoad;
    }
    
    function closeDialog(){
        // release the reference to the file by revoking the Object URL
        window.URL.revokeObjectURL(url);
        
        document.getElementById('pdf-load').remove();
    }

}(window));