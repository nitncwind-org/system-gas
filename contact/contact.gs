function doPost(e) {
  var response = {};  

  try {
    // parameterを取得
    var param = e.parameter;

    // ファイルID
    var FILE_ID = "xxxxxxxxxxxxxxxxxxxx";

    // リストネーム
    var LIST_NAME = "contact";

    // spreadsheetを開く
    var sheet = SpreadsheetApp.openById(FILE_ID).getSheetByName(LIST_NAME);

    // 今の日付取得
    var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');


    // sheetに情報を追加
    sheet.appendRow([param.name, param.affiliation, param.affiliation_kosen, param.affiliation_group, param.mail, param.inquiry, param.content, now]);

    informContact(param, now);

    response["success"] = "true";
    response["message"] = "";
  }
  catch (error) {
    response["success"] = "false";
    var error_message = {};
    error_message["name"] = error.name;
    error_message["resource"] = error.fileName + "(Line " + error.lineNumber + ")";
    error_message["message"] = error.message;
    error_message["stack"] = error.stack;
    response["message"] = error_message;
    errorMail(response);
  }

  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));

  return output;
}


// お問い合わせメール通知
function informContact(param, now){
  var values = SpreadsheetApp.openById('xxxxxxxxxxxxxxxxx').getSheets()[0].getDataRange().getValues();
  var address = [];
  for (var i = 1; i < values.length; i++) {
    address.push(values[i][0]);
  }
  address.push(param.mail);
  var subject = '奈良高専吹奏楽部 | お問い合わせ';
  var body = HtmlService.createTemplateFromFile("message_mail");
  body.param = param;
  body.now = now;
  console.log(param);
  Logger.log(param);
  sendMail(param.mail, subject, body.evaluate().getContent(), address.join(","));
}

// メール送信
function sendMail(to, subject, mail_body, bcc){
  GmailApp.sendEmail(
    to,
    subject,
    '',
    {
      bcc: bcc,
      name: '奈良高専吹奏楽部',
      htmlBody: mail_body
    }
  );
  
}

// エラーメール送信
function errorMail(response){
  var mailaddress = 'xxxxxxxxxxxxxx@googlegroups.com';
  sendMail(mailaddress, 'error - contact', JSON.stringify(response), '');
}

