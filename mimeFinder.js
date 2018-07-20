(
    () => {
        //Check the file reader and blob is supported by browser
        if (!window.FileReader && !window.Blob) {
            console.log("Not supporting File reading");
            return;
        }
        const fileUploader = document.getElementById('file_upload');
        const resultDom = document.getElementById('result')
        //Match proper MIME type based on bytes read in the file
        const getMimeType = (header) => {
            let type;
            switch (header) {
                //.mkv extension matches the following signature with MIME type webm
                case "1a45dfa3":
                    type = "video/webm";
                    break;

                case "4f676753":
                    type = "video/ogg"
                    break;

                //.wmv extension have the following signatures	
                case "3026b275":
                case "66cf11":
                case "a6d900aa":
                case "62ce6c":
                    type = "video/x-ms-wmv"
                    break;
                //.avi 	
                case "52494646":
                    type = "video/x-msvideo"
                    break;
                //case matches the fytp signature belongs to a type of Mp4  	
                case (header.match(/66747970$/) || {}).input:
                    type = "video/mp4"
                    break;
                //case matches .mov extension to the MIME type of quicktime
                case (header.match(/6d6f6f76/) || {}).input:
                    type = "video/quicktime"
                    break;
                case "47494638":
                    type = "video/gif"

                default:
                    type = "UnIdentified Type";
                    break;
            }
            return type;
        }
        //convert in to hexadecimal signature
        const constructHeader = (content) => {
            let header = "";
            content.forEach((value) => {
                header += value.toString(16);
            })
            return header;
        }
        const readBlobHeader = (url, blob) => {
            const fileReader = new FileReader();
            fileReader.onloadend = (e) => {
                if (e.target.readyState === FileReader.DONE) {
                    //Read first four bytes of data
                    let uint = (new Uint8Array(e.target.result)).subarray(0, 4);
                    let header = constructHeader(uint);
                    //.MP4 and .Mov format files require to read 8 bytes of data and it has common 
                    //starting of 00 in the signature. Last 4 bytes is used to identify whether its mp4
                    // and mov
                    if (header.startsWith("00")) {
                        let mp4Uint = new Uint8Array(e.target.result);
                        header = constructHeader(mp4Uint)
                    }
                    let mimeType = getMimeType(header.toLowerCase());
                    resultDom.innerHTML = `<p>MIME Type : ${mimeType}</p>`;
                }
            }
            //Read first 8 bytes data of the provided file
            fileReader.readAsArrayBuffer(blob.slice(0, 8));
        }
        let uploadEvent = (event) => {
            let fileBlob = event.target.files[0];
            readBlobHeader(escape(fileBlob.name), fileBlob);
        }
        fileUploader.addEventListener('change', uploadEvent);
    }


)()