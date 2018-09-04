$(document).ready(function() {
    $('#waveIt').click(function() {
        uploadFile();
    });
});

function uploadFile() {
    var file_data = $('#chooseFile').prop('files')[0];
    var form_data = new FormData();
    var name = $('#chooseFile').val().replace(/^.*[\\\/]/, '');

    form_data.append('uploaded_file', file_data);
    form_data.append('name', name);
    console.log(name);

    $.ajax({
        url: "https://distractic.com/wave/api/UploadToServer.php",
        type: "POST",
        data: form_data,
        enctype: 'multipart/form-data',
        contentType: false,
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            saveWave("https://distractic.com/wave/api/uploads/" + name, name);
        }
    });
}

function saveWave(url, name) {
    var code = getCode();
    $.ajax({
        url: "https://lindaayangg.lib.id/waveit@dev/?wOperation=saveWave&wCode=" +
            code + "&wFilePath=" + url + "&wFileName=" + name,
        type: "GET",
        success: function(data) {
            console.log(data);
            console.log(code);
            startOsc(code);
        }
    });
}

function startOsc(codeSeq) {
    let audioCtx = new AudioContext();

    let osc = audioCtx.createOscillator();

    osc.frequency.value = map[codeSeq.substring(0, 1)];
    osc.frequency.setValueAtTime(map[codeSeq.substring(1, 2)], audioCtx.currentTime + 0.5);
    osc.frequency.setValueAtTime(map[codeSeq.substring(2, 3)], audioCtx.currentTime + 1);
    osc.frequency.setValueAtTime(map[codeSeq.substring(3, 4)], audioCtx.currentTime + 1.5);
    osc.frequency.setValueAtTime(map[codeSeq.substring(4, 5)], audioCtx.currentTime + 2);
    osc.frequency.setValueAtTime(map[codeSeq.substring(5, 6)], audioCtx.currentTime + 2.5);

    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 3.5);
}

var soundFreqs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var map = { A: 1200, B: 1400, C: 1600, D: 1800, E: 2000, F: 2200, G: 2400, H: 2600 }

function getCode() {
    var codeSeq = "";
    var lastCode = "";
    while (codeSeq.length < 6) {
        var i = Math.floor(Math.random() * 8);
        var newCode = soundFreqs[i];
        if (newCode !== lastCode) {
            codeSeq += newCode;
            lastCode = newCode;
        }
    }
    return codeSeq;
}