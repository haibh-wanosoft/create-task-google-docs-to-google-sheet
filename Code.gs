function doGet(e) {
  try {
    const docsId = e.parameter.docsId; // document id, ref: https://developers.google.com/apps-script/reference/document/document
    const docsTabId = e.parameter.docsTabId; // document content tab id, ref: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
    const sheetId = e.parameter.sheetId; // spreadsheet id, ref: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid

    const docUrlPrefix = `https://docs.google.com/document/d/${docsId}/edit?tab=${docsTabId}#heading=`;
    const sheetUrlPrefix = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=0#gid=0`;

    // Check if all parameters are provided
    if (!docsId || !docsTabId || !sheetId) {
      return HtmlService.createHtmlOutput(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <base target="_top">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                text-align: center;
              }
              .error {
                color: red;
                font-weight: bold;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="error">❌ エラー！</h2>
              <p>パラメータが不足しています。docsId、docsTabId、sheetIdをすべて指定してください。</p>
              <p>現在のパラメータ：</p>
              <ul style="list-style-type: none; padding: 0;">
                <li>docsId: ${docsId || "なし"}</li>
                <li>docsTabId: ${docsTabId || "なし"}</li>
                <li>sheetId: ${sheetId || "なし"}</li>
              </ul>
            </div>
          </body>
        </html>
      `
      )
        .setTitle("パラメータエラー")
        .setFaviconUrl(
          "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
        )
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    try {
      // Call main function to process
      extractHeadingsToSheet(docsId, docsTabId, docUrlPrefix, sheetId);

      // Create HTML result to display
      const htmlOutput = HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
          <head>
            <base target="_top">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                text-align: center;
              }
              .success {
                color: green;
                font-weight: bold;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
              }
              .btn {
                display: inline-block;
                padding: 10px 15px;
                margin: 10px 5px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
              }
              .btn-warning {
                background-color: #ffc107;
                color: #212529;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="success">✅ プロセスが正常に実行されました！</h2>
              <p>Google DocsからGoogle Sheetsにデータが抽出されました。</p>
              <p>Docs ID: ${docsId}</p>
              <p>Tab ID: ${docsTabId}</p>
              <p>Sheet ID: ${sheetId}</p>
              <p>Docs URL: <a target="_blank" href="${docUrlPrefix}">${docUrlPrefix}</a></p>
              <p>Sheet URL: <a target="_blank" href="${sheetUrlPrefix}">${sheetUrlPrefix}</a></p>
              <div>
                <a class="btn" href="${sheetUrlPrefix}" target="_blank">Google Sheetsを表示</a>
                <a class="btn btn-warning" href="${docUrlPrefix}" target="_blank">Google Docsを表示</a>
              </div>
            </div>
          </body>
        </html>
      `);

      // Set necessary properties and return
      return htmlOutput
        .setTitle("処理結果")
        .setFaviconUrl(
          "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
        )
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch (processingError) {
      // Check if error related to existing data in sheet
      if (
        processingError.message.includes("既に") &&
        processingError.message.includes("レコード")
      ) {
        // Get sheet information from error
        const errorMessage = processingError.message;

        // Create HTML error notification for the case sheet already has data
        const htmlOutput = HtmlService.createHtmlOutput(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_top">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  text-align: center;
                }
                .warning {
                  color: #856404;
                  font-weight: bold;
                }
                .container {
                  max-width: 700px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ffeeba;
                  border-radius: 5px;
                  background-color: #fff3cd;
                }
                .btn {
                  display: inline-block;
                  padding: 10px 15px;
                  margin: 10px 5px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                }
                .btn-warning {
                  background-color: #ffc107;
                  color: #212529;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="warning">⚠️ シートにデータが既に存在します！</h2>
                <p>${errorMessage}</p>
                <p>続行するには、次のいずれかを実行できます。</p>
                <ul style="text-align: left; display: inline-block;">
                  <li>新しいシートを作成し、ヘッダーのみを保持</li>
                  <li>現在のシートのデータを削除し、ヘッダーのみを保持</li>
                </ul>
                <div>
                  <a class="btn" href="${sheetUrlPrefix}" target="_blank">Google Sheetsを表示</a>
                  <a class="btn btn-warning" href="${docUrlPrefix}" target="_blank">Google Docsを表示</a>
                </div>
              </div>
            </body>
          </html>
        `);

        return htmlOutput
          .setTitle("警告 - シートにデータが既に存在します")
          .setFaviconUrl(
            "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
          )
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } else {
        // Other errors - use general error message
        throw processingError;
      }
    }
  } catch (error) {
    // Handle error and display error message
    Logger.log("エラー: " + error.toString());
    return HtmlService.createHtmlOutput(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .error {
              color: red;
              font-weight: bold;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラーが発生しました！</h2>
            <p>処理が正常に完了しませんでした。</p>
            <p>エラーの詳細：</p>
            <div style="text-align: left; background-color: #ffe6e6; padding: 10px; border-radius: 5px; margin-top: 10px;">
              <code>${error.toString()}</code>
            </div>
          </div>
        </body>
      </html>
    `
    )
      .setTitle("処理エラー")
      .setFaviconUrl(
        "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
      )
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * params
 * docsId: document id, ref: https://developers.google.com/apps-script/reference/document/document
 * docsTabId: document content tab id, ref: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
 * sheetId: spreadsheet id, ref: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
 */
function extractHeadingsToSheet(docsId, docsTabId, docUrlPrefix, sheetId) {
  const doc = DocumentApp.openById(docsId);
  const documentTab = doc.getTab(docsTabId).asDocumentTab();
  const bodyTab = documentTab.getBody();
  const paragraphsTab = bodyTab.getParagraphs();

  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  const sheetValues = sheet.getDataRange().getValues();
  const sheetName = sheet.getName();
  const spreadsheetName = SpreadsheetApp.openById(sheetId).getName();
  const recordCount = sheetValues.length - 1; // Số lượng bản ghi (trừ header)

  // Check if sheet already has data (excluding header)
  if (sheetValues.length > 1) {
    // Sheet already has data (excluding header)
    Logger.log(
      `シートには既に${recordCount}件のレコードがあります。新しいデータの書き込みは行いません。`
    );

    // Return detailed error message
    throw new Error(
      `Google Sheet "${spreadsheetName}" （シート名：${sheetName}）には既に${recordCount}件のレコードがあります。` +
        `既存のデータを上書きすることはできません。続行するには、空のシート（ヘッダーのみ）を使用してください。`
    );
  }

  // Assume file sheet have one header row; start writing from the second row.
  let startRow = sheetValues.length + 1;
  let index = 1;

  // count index from current row (if have data before)
  if (sheetValues.length > 1) {
    index = sheetValues.length; // row 2 = index 1, row 3 = index 2, etc...
  }

  // create checkbox in column E
  const checkboxColumnE = createCheckboxToColumnE();

  // create checkbox in column H
  const checkboxColumnH = createCheckboxToColumnH();

  const regex = /.*（(修正|削除|新規)）$/; // only heading with title ending in `(修正|削除|新規)` are allowed create task

  // get heading links, use Advanced Google Services (Docs API), because Apps Script doesn't support get heading links
  // App script reference: https://developers.google.com/apps-script/reference/document/document#getHeadings
  // Docs API reference: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
  const headingLinks = getHeadingLinksUsingAdvancedDocsAPI(
    docsId,
    docsTabId,
    docUrlPrefix,
    regex
  );

  let currentParentHeading = ""; // save nearest heading

  paragraphsTab.forEach((p) => {
    const headingType = p.getHeading();
    const text = p.getText();

    if (headingType === DocumentApp.ParagraphHeading.NORMAL) return;

    // check and set currentParentHeading
    if (
      /^(Mutation|Query|アドミンの各ページ|ユーザーの各ページ|DB)$/.test(text)
    )
      currentParentHeading = p;

    if (regex.test(text)) {
      // check if current paragraph is sub heading of currentParentHeading
      if (!isSubHeading(headingType, currentParentHeading.getHeading())) return;

      // get Japanese label
      const defaultValueH = getLabelFromType(currentParentHeading.getText());

      const prefixTitleTask = getPrefixTitleTask(
        currentParentHeading.getText()
      );

      const linkReference = headingLinks.find(
        (headingLink) => headingLink.headingName === text.trim()
      );

      console.log("リンク参照を見つける", linkReference?.url);

      sheet.getRange(startRow, 1).setValue(index); // column A: index
      sheet.getRange(startRow, 2).setValue(`${prefixTitleTask} ${text}`); // column B: heading text
      sheet.getRange(startRow, 5).setValue("未着手"); // set default value column E
      sheet.getRange(startRow, 5).setDataValidation(checkboxColumnE); // column E: dropdown
      sheet.getRange(startRow, 8).setValue(defaultValueH); // set default value column H
      sheet.getRange(startRow, 8).setDataValidation(checkboxColumnH); // column H: dropdown

      const urlStyle = createRichTextValue(linkReference?.url || docUrlPrefix);
      sheet.getRange(startRow, 9).setRichTextValue(urlStyle);

      startRow++;
      index++;
    }
  });

  // add conditional formatting for column E
  applyColorRulesToColumnE(sheet);

  // add conditional formatting for column H
  applyColorRulesToColumnH(sheet);
  Logger.log("✔ Google Sheetにデータが書き込まれました。");
}

/**
 * params
 * docsId: document id, ref: https://developers.google.com/apps-script/reference/document/document
 * docsTabId: document content tab id, ref: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
 * sheetId: spreadsheet id, ref: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
 */
function getHeadingLinksUsingAdvancedDocsAPI(
  docsId,
  docsTabId,
  docUrl,
  regexTitleHeading
) {
  const doc = Docs.Documents.get(docsId, {
    includeTabsContent: true,
  });

  // find tab by tabId
  const targetTab = doc.tabs.find(
    (tab) => tab.tabProperties.tabId === docsTabId
  );

  const content =
    targetTab && targetTab.documentTab && targetTab.documentTab.body
      ? targetTab.documentTab.body.content
      : [];

  if (content.length === 0) {
    console.log("タブが見つからないか、コンテンツがありません");
    return [];
  }

  const headingLinks = [];
  for (const element of content) {
    const para = element.paragraph;
    if (!para) continue;

    const style = para.paragraphStyle;
    if (!style) continue;

    const namedStyle = style.namedStyleType;
    const headingId = style.headingId;

    if (namedStyle && namedStyle.startsWith("HEADING") && headingId) {
      // get actual text from heading
      const text = para.elements
        .map((el) => el.textRun?.content ?? "")
        .join("")
        .trim();

      if (!regexTitleHeading.test(text)) continue;
      const link = docUrl + headingId;
      headingLinks.push({ headingName: text, url: link });
    }
  }

  return headingLinks;
}

function createCheckboxToColumnE() {
  const options = [
    "未着手",
    "対応中",
    "レビューはオフショア",
    "親プルリクエストに依存",
    "レビューは日本の方",
    "完了",
  ];

  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options)
    .setAllowInvalid(false)
    .build();

  return dataValidation;
}

function applyColorRulesToColumnE(sheet) {
  const rules = sheet.getConditionalFormatRules();

  // Rule 1: If value is "未着手" (Not Started) then fill with light gray
  const rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("未着手")
    .setBackground("#e6e6e6")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 2: If value is "対応中" (In Progress) then fill with light pink
  const rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("対応中")
    .setBackground("#ffcfc9")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 3: If value is "レビューはオフショア" (Review Offshore) then fill with light yellow
  const rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("レビューはオフショア")
    .setBackground("#ffe5a0")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 4: If value is "親プルリクエストに依存" (Depends on Parent Pull Request) then fill with light blue
  const rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("親プルリクエストに依存")
    .setBackground("#0a53a8")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 5: If value is "レビューは日本の方" (Review by Japanese) then fill with light red
  const rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("レビューは日本の方")
    .setBackground("#b10202")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 6: If value is "完了" (Completed) then fill with light green
  const rule6 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("完了")
    .setBackground("#d4edbc")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Override all existing rules for column E
  rules.push(rule1);
  rules.push(rule2);
  rules.push(rule3);
  rules.push(rule4);
  rules.push(rule5);
  rules.push(rule6);
  sheet.setConditionalFormatRules(rules);
}

function createCheckboxToColumnH() {
  const options = ["選択", "フロントエンド", "サーバーサイド", "DB"];
  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options)
    .setAllowInvalid(false)
    .build();

  return dataValidation;
}

function applyColorRulesToColumnH(sheet) {
  const rules = sheet.getConditionalFormatRules();

  // Rule 1: If value is "選択" (Select) then fill with light gray
  const rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("選択")
    .setBackground("#e6e6e6")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 2: If value is "フロントエンド" (Frontend) then fill with light pink
  const rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("フロントエンド")
    .setBackground("#ffc8aa")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 3: If value is "サーバーサイド" (Backend) then fill with light yellow
  const rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("サーバーサイド")
    .setBackground("#ffe5a0")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 4: If value is "DB" (Database) then fill with light red
  const rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("DB")
    .setBackground("#b10202")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Override all existing rules for column H
  rules.push(rule1);
  rules.push(rule2);
  rules.push(rule3);
  rules.push(rule4);
  sheet.setConditionalFormatRules(rules);
}

function isSubHeading(input1, input2) {
  const headingLevels = {
    [DocumentApp.ParagraphHeading.HEADING1]: 1,
    [DocumentApp.ParagraphHeading.HEADING2]: 2,
    [DocumentApp.ParagraphHeading.HEADING3]: 3,
    [DocumentApp.ParagraphHeading.HEADING4]: 4,
    [DocumentApp.ParagraphHeading.HEADING5]: 5,
    [DocumentApp.ParagraphHeading.HEADING6]: 6,
  };

  const level1 = headingLevels[input1] || 0;
  const level2 = headingLevels[input2] || 0;

  return level1 > level2;
}

function getLabelFromType(input) {
  const labels = {
    Mutation: "サーバーサイド",
    Query: "サーバーサイド",
    アドミンの各ページ: "フロントエンド",
    ユーザーの各ページ: "フロントエンド",
    DB: "DB",
  };

  return labels[input] || "選択";
}

function getPrefixTitleTask(input) {
  const labels = {
    Mutation: "[michibiku-server]",
    Query: "[michibiku-server]",
    アドミンの各ページ: "[michibiku-client]",
    ユーザーの各ページ: "[michibiku-client]",
    DB: "[michibiku-db]",
  };

  return labels[input] || "[michibiku-task]";
}

function createRichTextValue(url) {
  const prefix = "- 修正方針リンク: ";
  const fullText = prefix + url;

  const builder = SpreadsheetApp.newRichTextValue()
    .setText(fullText)
    // set hyperlink for the part after (the link part)
    .setLinkUrl(prefix.length, fullText.length, url)
    .build();

  return builder;
}
