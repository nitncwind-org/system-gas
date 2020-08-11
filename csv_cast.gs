// get処理
function doGet(e) {
  // parameter取得
  var params = e.parameter;
   
  // パラメーター keyからファイルIDを取得
  var file_id = convertP2f(params.key);
  
  // 0（存在しない）ときは文字列返す
  if (file_id == '0') {
    ContentService.createTextOutput().setMimeType(ContentService.MimeType.TEXT).setContent("404");
  }
  
  // CSVデータを取得
  var csvData = convertSp2Csv(file_id);
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.TEXT).setContent(csvData);
  Logger.log(csvData);
  return out;
}

// スプレッドシートをcsvに変換
function convertSp2Csv(file_id) {
  var values = SpreadsheetApp.openById(file_id).getSheets()[0].getDataRange().getValues();
  var data = [];
  for (var i = 0; i < values.length; i++) {
    data.push(values[i].join(","));
  }
  Logger.log(data.join("\r\n"));
  return data.join("\r\n");
}
