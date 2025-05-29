/**
 * doGet function modified to display input form instead of taking parameters
 */
function doGet(e) {
  try {
    // Log the parameters to see what's received
    Logger.log("Request parameters: " + JSON.stringify(e.parameter));

    // If parameters are passed, use the old method for extracting headings
    if (e.parameter.docsId && e.parameter.docsTabId && e.parameter.sheetId) {
      return processWithParameters(e);
    }

    // If githubForm parameter is provided, show GitHub issue creation form
    if (e.parameter.action === "githubForm") {
      return createGithubFormHtml();
    }

    // If docsForm parameter is provided, show heading extraction form
    if (e.parameter.action === "docsForm") {
      Logger.log("Displaying docs form");
      return createFormHtml();
    }

    // If createGithubIssues parameter is provided, process GitHub issue creation
    if (e.parameter.action === "createGithubIssues") {
      return processGithubIssueCreation(e);
    }

    // If no parameters, display the main menu
    return createMainMenuHtml();
  } catch (error) {
    // Handle general errors with more detailed logging
    Logger.log("Error in doGet: " + error.toString());
    Logger.log("Stack trace: " + error.stack);

    // Return error HTML
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
            .btn-warning {
              background-color: #ffc107;
              color: #212529;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
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
            <p>
              <a class="btn btn-secondary" href="#" onclick="window.location.href = window.location.pathname; return false;">ホームに戻る</a>
            </p>
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
 * Create main menu HTML with three buttons for choosing functionality
 */
function createMainMenuHtml() {
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <title>Michibiku ツール</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
            text-align: center;
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
          }
          .btn-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 40px;
            flex-wrap: wrap;
          }
          .btn {
            display: block;
            width: 280px;
            padding: 15px 20px;
            background-color: #4285f4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 20px;
            text-align: center;
            transition: background-color 0.3s;
            cursor: pointer;
            border: none;
          }
          .btn:hover {
            background-color: #3367d6;
          }
          .btn-github {
            background-color: #2ea44f;
          }
          .btn-github:hover {
            background-color: #2c974b;
          }
          .btn-project {
            background-color: #6f42c1;
          }
          .btn-project:hover {
            background-color: #5a32a3;
          }
          .feature-description {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            height: 60px;
          }
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            background-color: white;
            width: 280px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s;
          }
          .card:hover {
            transform: translateY(-5px);
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          #loading {
            display: none;
            text-align: center;
            margin: 20px 0;
          }
          .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Michibiku タスク管理ツール</h1>
          
          <div class="btn-container">
            <div class="card">
              <h3>Google Docs から Google Sheets</h3>
              <div class="feature-description">
                Google Docsのヘッダーを抽出し、Google Sheetsにタスクとして一覧化します。
              </div>
              <button onclick="showDocsForm()" class="btn">Sheetsにタスクを抽出</button>
            </div>
            
            <div class="card">
              <h3>Google Sheets から GitHub</h3>
              <div class="feature-description">
                Google Sheetsのタスク一覧からGitHub Issuesを一括作成します。
              </div>
              <button onclick="showGithubForm()" class="btn btn-github">GitHub Issuesを作成</button>
            </div>
            
            <div class="card">
              <h3>GitHub Projectに追加</h3>
              <div class="feature-description">
                ステータスが「対応中」のタスクからIssueを作成し、GitHub Projectに追加します。
              </div>
              <button onclick="showProjectForm()" class="btn btn-project">Projectにタスクを追加</button>
            </div>
          </div>
          
          <div id="loading">
            <div class="spinner"></div>
            <span>読み込み中...</span>
          </div>
          
          <div class="footer">
            <p>© 2023 Michibiku Project - App Script Tool</p>
          </div>
        </div>
        
        <script>
          function showDocsForm() {
            document.getElementById('loading').style.display = 'block';
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .withFailureHandler(function(error) {
                document.getElementById('loading').style.display = 'none';
                alert('エラーが発生しました: ' + error);
              })
              .getDocsForm();
          }
          
          function showGithubForm() {
            document.getElementById('loading').style.display = 'block';
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .withFailureHandler(function(error) {
                document.getElementById('loading').style.display = 'none';
                alert('エラーが発生しました: ' + error);
              })
              .getGithubForm();
          }
          
          function showProjectForm() {
            document.getElementById('loading').style.display = 'block';
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .withFailureHandler(function(error) {
                document.getElementById('loading').style.display = 'none';
                alert('エラーが発生しました: ' + error);
              })
              .getProjectForm();
          }
        </script>
      </body>
    </html>
  `);

  return htmlOutput
    .setTitle("Michibiku タスク管理ツール")
    .setFaviconUrl(
      "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Create GitHub issue form HTML
 */
function createGithubFormHtml() {
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <title>GitHub Issues作成</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .submit-btn {
            background-color: #2ea44f;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: block;
            margin: 20px auto;
          }
          .submit-btn:hover {
            background-color: #2c974b;
          }
          .submit-btn:disabled {
            background-color: #b3b3b3;
            cursor: not-allowed;
          }
          .instructions {
            background-color: #e8f0fe;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status-message {
            display: none;
            margin: 15px 0;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
          .status-message.processing {
            display: block;
            background-color: #e8f0fe;
            color: #174ea6;
          }
          .status-message.error {
            display: block;
            background-color: #fce8e6;
            color: #c5221f;
            border: 1px solid #fad2cf;
          }
          .status-message.success {
            display: block;
            background-color: #e6f4ea;
            color: #137333;
            border: 1px solid #ceead6;
          }
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          .btn-back {
            background-color: #6c757d;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-bottom: 20px;
            cursor: pointer;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <button onclick="returnToMainMenu()" class="btn-back">← メインメニューに戻る</button>
          <h1>Google Sheets から GitHub Issuesを作成</h1>
          
          <div class="instructions">
            <h3>使用方法：</h3>
            <p>Google SheetsのデータからGitHub Issuesを作成するには、以下の情報を入力してください。</p>
          </div>
          
          <form id="githubForm" onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="spreadsheetId">Google Spreadsheet ID:</label>
              <input type="text" id="spreadsheetId" name="spreadsheetId" required>
              <div class="hint">例：1gPoVdBm0sc3FyEK7aJJmpZli44Gzt-de8EcZUu-0GCE (URLから取得できます)</div>
            </div>
            
            <div class="form-group">
              <label for="sheetName">Sheet名:</label>
              <input type="text" id="sheetName" name="sheetName" required>
              <div class="hint">例：Sheet1</div>
            </div>
            
            <div class="form-group">
              <label for="githubToken">GitHub Token:</label>
              <input type="text" id="githubToken" name="githubToken" required>
              <div class="hint">GitHubの個人アクセストークン (PAT)</div>
            </div>
            
            <div class="form-group">
              <label for="owner">リポジトリ所有者:</label>
              <input type="text" id="owner" name="owner" required>
              <div class="hint">例：octocat</div>
            </div>
            
            <div class="form-group">
              <label for="repo">リポジトリ名:</label>
              <input type="text" id="repo" name="repo" required>
              <div class="hint">例：hello-world</div>
            </div>
            
            <div class="form-group">
              <label for="templatePath">テンプレートパス:</label>
              <input type="text" id="templatePath" name="templatePath" required>
              <div class="hint">例：.github/ISSUE_TEMPLATE/normal-task.md</div>
            </div>
            
            <div class="form-group">
              <label for="enableSubIssue">Sub Issueを有効にする:</label>
              <input type="checkbox" id="enableSubIssue" name="enableSubIssue">
              <div class="hint">作成したIssueを親IssueのタスクリストとしてMarkdownフォーマットで追加します（- [ ] #123 のような形式）</div>
            </div>

            <div class="form-group sub-issue-options" style="display:none;">
              <label for="parentIssueId">親Issue ID:</label>
              <input type="number" id="parentIssueId" name="parentIssueId" min="1">
              <div class="hint">親IssueのID番号（例：123）。新しく作成されるIssueはこのIssueの説明文にタスクとして追加されます。</div>
              <div class="token-notice" style="margin-top: 10px; padding: 8px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; font-size: 13px; color: #856404;">
                <strong>ℹ️ 注意:</strong> 作成されたIssueは親IssueのMarkdownタスクリストとして追加されます（- [ ] #123 形式）。<br>
                Fine-grained tokenでも使用可能です。
              </div>
            </div>
            
            <div id="statusMessage" class="status-message">
              <div class="spinner"></div>
              <span id="statusText">処理中...</span>
            </div>
            
            <button type="submit" class="submit-btn">GitHub Issuesを作成</button>
          </form>
          
          <div class="footer">
            <p>注意：GitHub Issuesを作成するには、適切な権限を持つGitHub Tokenが必要です。</p>
          </div>
        </div>
        
        <script>
          function returnToMainMenu() {
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .getMainMenu();
          }
        
          function handleSubmit(event) {
            event.preventDefault();
            const form = document.getElementById('githubForm');
            const spreadsheetId = form.spreadsheetId.value.trim();
            const sheetName = form.sheetName.value.trim();
            const githubToken = form.githubToken.value.trim();
            const owner = form.owner.value.trim();
            const repo = form.repo.value.trim();
            const templatePath = form.templatePath.value.trim();
            const enableSubIssue = form.enableSubIssue.checked;
            const parentIssueId = enableSubIssue ? form.parentIssueId.value.trim() : '';
            
            // Validate form inputs
            if (!spreadsheetId || !sheetName || !githubToken || !owner || !repo || !templatePath) {
              alert('すべてのフィールドを入力してください。');
              return false;
            }
            
            // Validate parent issue ID if sub-issue is enabled
            if (enableSubIssue && !parentIssueId) {
              alert('親IssueのIDを入力してください。');
              return false;
            }
            
            // Show processing message
            const submitButton = document.querySelector('.submit-btn');
            submitButton.innerHTML = '処理中...';
            submitButton.disabled = true;
            
            // Display status message
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.className = 'status-message processing';
            document.getElementById('statusText').innerText = 'GitHub Issuesを作成中...';
            
            // Send form via google.script.run
            google.script.run
              .withSuccessHandler(function(html) {
                // Update status message
                statusMessage.className = 'status-message success';
                document.getElementById('statusText').innerText = '完了しました！結果ページに移動中...';
                
                // Add small delay so user can see success message
                setTimeout(function() {
                  // Replace entire page with result HTML
                  document.open();
                  document.write(html);
                  document.close();
                }, 1000);
              })
              .withFailureHandler(function(error) {
                // Update status message
                statusMessage.className = 'status-message error';
                document.getElementById('statusText').innerText = 'エラーが発生しました';
                
                // Restore submit button and display error
                submitButton.innerHTML = 'GitHub Issuesを作成';
                submitButton.disabled = false;
                alert('エラーが発生しました: ' + error);
                console.error(error);
              })
              .processGithubForm({
                spreadsheetId: spreadsheetId,
                sheetName: sheetName,
                githubToken: githubToken,
                owner: owner,
                repo: repo,
                templatePath: templatePath,
                enableSubIssue: enableSubIssue,
                parentIssueId: parentIssueId
              });
            
            return false;
          }

          document.getElementById('enableSubIssue').addEventListener('change', function() {
            const subIssueOptions = document.querySelector('.sub-issue-options');
            if (this.checked) {
              subIssueOptions.style.display = 'block';
            } else {
              subIssueOptions.style.display = 'none';
            }
          });
        </script>
      </body>
    </html>
  `);

  return htmlOutput
    .setTitle("GitHub Issues作成ツール")
    .setFaviconUrl(
      "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Process GitHub issue creation form
 */
function processGithubForm(formObject) {
  try {
    // Get values from form
    const spreadsheetId = formObject.spreadsheetId;
    const sheetName = formObject.sheetName;
    const githubToken = formObject.githubToken;
    const owner = formObject.owner;
    const repo = formObject.repo;
    const templatePath = formObject.templatePath;
    const enableSubIssue = formObject.enableSubIssue || false;
    const parentIssueId = formObject.parentIssueId
      ? Number(formObject.parentIssueId)
      : null;

    // Call function to create GitHub issues
    const result = createGithubIssuesFromSheet(
      spreadsheetId,
      sheetName,
      githubToken,
      owner,
      repo,
      templatePath,
      enableSubIssue,
      parentIssueId
    );

    // Check if there are task-relation errors
    const hasTaskErrors = result.errors.some(
      (error) =>
        error.includes("sub-task") ||
        error.includes("⚠️") ||
        error.includes("parent issue") ||
        error.includes("task")
    );

    // Create HTML result to display
    const htmlOutput = `
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
            .warning {
              color: #856404;
              background-color: #fff3cd;
              border: 1px solid #ffeeba;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              text-align: left;
            }
            .info-box {
              color: #0c5460;
              background-color: #d1ecf1;
              border: 1px solid #bee5eb;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              text-align: left;
            }
            .container {
              max-width: 700px;
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
              background-color: #2ea44f;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              border: none;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
            .results {
              text-align: left;
              margin: 20px 0;
              max-height: 300px;
              overflow-y: auto;
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #ddd;
            }
            .issue-item {
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #eee;
            }
            .issue-number {
              font-weight: bold;
              color: #0366d6;
            }
            .subtask-badge {
              display: inline-block;
              background-color: #6f42c1;
              color: white;
              font-size: 12px;
              padding: 3px 8px;
              border-radius: 10px;
              margin-left: 8px;
              vertical-align: middle;
            }
            .error-section {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              border-radius: 4px;
              padding: 10px 15px;
              margin-top: 15px;
            }
            .error-item {
              color: #721c24;
              margin: 5px 0;
            }
            .summary {
              margin-top: 15px;
              padding: 10px;
              background-color: #f0f0f0;
              border-radius: 4px;
              text-align: center;
              font-weight: bold;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 15px 0;
              text-align: center;
            }
            .stat-item {
              padding: 10px;
              border-radius: 4px;
              min-width: 120px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin: 5px 0;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            .created {
              background-color: #e6f4ea;
              color: #137333;
            }
            .skipped {
              background-color: #e8eaed;
              color: #5f6368;
            }
            .errors {
              background-color: #fce8e6;
              color: #c5221f;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="success">✅ GitHub Issuesの処理が完了しました！</h2>
            <p>Google Sheetsの行からGitHub Issuesが処理されました。</p>
            <p>スプレッドシートID: ${spreadsheetId}</p>
            <p>シート名: ${sheetName}</p>
            <p>リポジトリ: ${owner}/${repo}</p>
            
            ${
              hasTaskErrors && enableSubIssue
                ? `
            <div class="warning">
              <p><strong>⚠️ 注意:</strong> Issueは作成されましたが、親Issueのタスクリストに追加できませんでした。</p>
              <p>詳細はエラーセクションを確認してください。</p>
            </div>
            `
                : ""
            }
            
            ${
              enableSubIssue &&
              parentIssueId &&
              !hasTaskErrors &&
              result.issuesCreated.length > 0
                ? `
            <div class="info-box">
              <p><strong>ℹ️ 情報:</strong> ${result.issuesCreated.length}件のIssueが作成され、親Issue #${parentIssueId}のタスクリストに追加されました。</p>
              <p>タスクリストは親Issueの説明欄に「- [ ] #123 Issue title」形式で追加されています。</p>
            </div>
            `
                : ""
            }
            
            <div class="stats">
              <div class="stat-item created">
                <div class="stat-value">${result.issuesCreated.length}</div>
                <div class="stat-label">作成されたIssue</div>
              </div>
              <div class="stat-item skipped">
                <div class="stat-value">${result.skipped || 0}</div>
                <div class="stat-label">スキップされた行</div>
              </div>
              <div class="stat-item errors">
                <div class="stat-value">${result.errors.length}</div>
                <div class="stat-label">エラー</div>
              </div>
            </div>
            
            <div class="results">
              <h3>作成されたIssues:</h3>
              ${
                result.issuesCreated.length > 0
                  ? `
                <div class="summary">${
                  result.issuesCreated.length
                }件のIssueが作成されました</div>
                ${result.issuesCreated
                  .map(
                    (issue) =>
                      `<div class="issue-item">
                    <span class="issue-number">#${issue.number}</span> - 
                    <a href="${issue.html_url}" target="_blank">${
                        issue.title
                      }</a>
                    ${
                      issue.isSubIssue
                        ? `<span class="subtask-badge">タスク in #${issue.parentIssue}</span>`
                        : ""
                    }
                  </div>`
                  )
                  .join("")}
                `
                  : `<p>新しく作成されたIssueはありません。</p>`
              }
              
              ${
                result.skipped > 0
                  ? `<div class="info-box" style="margin-top: 15px;">
                <p><strong>ℹ️ 情報:</strong> ${result.skipped}行はすでにIssueが作成済みのためスキップされました。</p>
              </div>`
                  : ""
              }
              
              ${
                result.errors.length > 0
                  ? `<div class="error-section">
                <h3>エラー:</h3>
                ${result.errors
                  .map(
                    (error) =>
                      `<div class="error-item">
                    ${error}
                  </div>`
                  )
                  .join("")}
                </div>`
                  : ""
              }
            </div>
            
            <div>
              <a class="btn" href="https://github.com/${owner}/${repo}/issues" target="_blank">GitHubでIssuesを表示</a>
              ${
                enableSubIssue && parentIssueId
                  ? `
              <a class="btn" href="https://github.com/${owner}/${repo}/issues/${parentIssueId}" target="_blank">親Issueを表示</a>
              `
                  : ""
              }
              <a class="btn" href="https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0" target="_blank">スプレッドシートを表示</a>
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </div>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
        </body>
      </html>
    `;

    return htmlOutput;
  } catch (error) {
    Logger.log("GitHub form processing error: " + error);

    // Create an HTML error page
    const errorHtml = `
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
            .btn {
              display: inline-block;
              padding: 10px 15px;
              margin: 10px 5px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              border: none;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラーが発生しました！</h2>
            <p>GitHub Issuesの作成中にエラーが発生しました。</p>
            <p>エラーの詳細：</p>
            <div style="text-align: left; background-color: #ffe6e6; padding: 10px; border-radius: 5px; margin-top: 10px;">
              <code>${error.toString()}</code>
            </div>
            <p>
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </p>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
        </body>
      </html>
    `;

    return errorHtml;
  }
}

/**
 * Create GitHub issues from sheet with parameters
 * @param {string} spreadsheetId - ID of the Google Spreadsheet
 * @param {string} sheetName - Sheet name
 * @param {string} githubToken - GitHub token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} templatePath - Path to the template
 * @param {boolean} enableSubIssue - Whether to create sub-issues
 * @param {number} parentIssueId - Parent issue ID
 */
function createGithubIssuesFromSheet(
  spreadsheetId,
  sheetName,
  githubToken,
  owner,
  repo,
  templatePath,
  enableSubIssue = false,
  parentIssueId = 1
) {
  // Get sheet from id
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  // Find index of columns
  const header = data[0];
  const itemIndex = header.indexOf("項目");
  const itemIndexLink = header.indexOf("メモ");

  // Find or create "Issue" column
  let issueColumnIndex = header.indexOf("Issue");
  if (issueColumnIndex === -1) {
    // Column doesn't exist, create it
    issueColumnIndex = header.length;
    sheet.getRange(1, issueColumnIndex + 1).setValue("Issue");
  }

  if (itemIndex < 0 || itemIndexLink < 0) {
    throw new Error('Column "項目" or "メモ" not found in the sheet');
  }

  // Get template from GitHub
  const templateRaw = getTemplateFromRepo(
    githubToken,
    owner,
    repo,
    templatePath
  );
  const templateBody = stripFrontMatter(templateRaw);

  // Track results
  const result = {
    issuesCreated: [],
    errors: [],
    skipped: 0, // Track how many rows were skipped because they already had an issue
  };

  // Collect all created issues to add as tasks later (performance optimization)
  const createdIssues = [];

  // Loop through each row (skip header)
  for (let i = 1; i < data.length; i++) {
    const issueTitle = data[i][itemIndex];
    const issueLink = data[i][itemIndexLink];
    const existingIssue = data[i][issueColumnIndex];

    // Skip if no title or link, or if issue already exists
    if (!issueTitle || !issueLink) continue;

    // Check if the row already has an issue number in the Issue column
    if (existingIssue) {
      Logger.log(
        `Skipping row ${i + 1} as it already has an issue: ${existingIssue}`
      );
      result.skipped++;
      continue;
    }

    try {
      const issueBody = insertLinkIntoSection(
        templateBody,
        "## リンク",
        issueLink
      );

      // Create new issue
      const response = createIssueWithTemplate(
        githubToken,
        owner,
        repo,
        issueTitle,
        issueBody
      );
      const responseData = JSON.parse(response.getContentText());

      // Update the sheet with the issue number
      const issueNumberLink = createGithubIssueLink(
        owner,
        repo,
        responseData.number
      );
      sheet
        .getRange(i + 1, issueColumnIndex + 1)
        .setRichTextValue(issueNumberLink);

      // Log success and add to results
      Logger.log(
        "Created issue: " + responseData.title + " #" + responseData.number
      );

      // Store for batch processing
      if (enableSubIssue && parentIssueId) {
        createdIssues.push({
          number: responseData.number,
          title: responseData.title,
        });
      }

      result.issuesCreated.push({
        title: responseData.title,
        number: responseData.number,
        html_url: responseData.html_url,
        isSubIssue: enableSubIssue && parentIssueId ? true : false,
        parentIssue: enableSubIssue && parentIssueId ? parentIssueId : null,
        rowIndex: i + 1, // Store the row index for reference
      });
    } catch (e) {
      // Log error and add to results
      Logger.log("Error creating issue: " + issueTitle + " - " + e);
      result.errors.push("Issue '" + issueTitle + "': " + e.toString());
    }
  }

  // Now add all issues as tasks to parent issue at once (if enabled)
  if (enableSubIssue && parentIssueId && createdIssues.length > 0) {
    try {
      const batchResult = addMultipleIssuesToParent(
        githubToken,
        owner,
        repo,
        parentIssueId,
        createdIssues
      );

      if (!batchResult.success) {
        result.errors.push(
          `⚠️ Issues were created but could not be added as tasks to parent issue #${parentIssueId}: ${batchResult.error}`
        );
      }
    } catch (error) {
      result.errors.push(
        `⚠️ Issues were created but could not be added as tasks to parent issue #${parentIssueId}: ${error.toString()}`
      );
    }
  }

  return result;
}

/**
 * Create a rich text value with a clickable GitHub issue link
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} issueNumber - GitHub issue number
 * @returns {RichTextValue} A rich text value with hyperlink
 */
function createGithubIssueLink(owner, repo, issueNumber) {
  const issueUrl = `https://github.com/${owner}/${repo}/issues/${issueNumber}`;
  const displayText = `#${issueNumber}`;

  const builder = SpreadsheetApp.newRichTextValue()
    .setText(displayText)
    .setLinkUrl(0, displayText.length, issueUrl)
    .build();

  return builder;
}

/**
 * Add multiple issues as task items in the parent issue's description
 * This function improves performance by updating the parent issue only once
 * @param {string} token - GitHub token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} parentIssueNumber - Parent issue number
 * @param {Array} childIssues - Array of child issues with {number, title} format
 * @returns {Object} Response object with success status and message
 */
function addMultipleIssuesToParent(
  token,
  owner,
  repo,
  parentIssueNumber,
  childIssues
) {
  try {
    // First, get the current parent issue to retrieve its description
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${parentIssueNumber}`;
    const getOptions = {
      method: "get",
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github+json",
      },
      muteHttpExceptions: true,
    };

    const getResponse = UrlFetchApp.fetch(getUrl, getOptions);
    const responseCode = getResponse.getResponseCode();

    if (responseCode !== 200) {
      return {
        success: false,
        error: `Failed to get parent issue. Status code: ${responseCode}`,
        responseCode: responseCode,
      };
    }

    const parentIssue = JSON.parse(getResponse.getContentText());
    let parentBody = parentIssue.body || "";

    // If there's no Sub-tasks section, add one
    if (!parentBody.includes("## Sub-tasks")) {
      parentBody += "\n\n## Sub-tasks";
    }

    // Add all task entries at once
    for (const issue of childIssues) {
      // Format: - [ ] #123 Issue title
      const taskEntry = `\n- [ ] #${issue.number} ${issue.title}`;
      parentBody += taskEntry;
    }

    // Update the parent issue with the new description
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${parentIssueNumber}`;
    const payload = {
      body: parentBody,
    };

    const updateOptions = {
      method: "patch",
      contentType: "application/json",
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github+json",
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const updateResponse = UrlFetchApp.fetch(updateUrl, updateOptions);
    const updateResponseCode = updateResponse.getResponseCode();

    if (updateResponseCode === 200) {
      return {
        success: true,
        data: JSON.parse(updateResponse.getContentText()),
        issuesAdded: childIssues.length,
      };
    } else {
      return {
        success: false,
        error: `Failed to update parent issue. Status code: ${updateResponseCode}`,
        responseCode: updateResponseCode,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.toString(),
      responseCode: 500,
    };
  }
}

/**
 * Process with parameters as before
 */
function processWithParameters(e) {
  const docsId = e.parameter.docsId;
  const docsTabId = e.parameter.docsTabId;
  const sheetId = e.parameter.sheetId;

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
            .btn-secondary {
              background-color: #6c757d;
              color: white;
              padding: 8px 15px;
              border: none;
              border-radius: 4px;
              text-decoration: none;
              display: inline-block;
              font-size: 14px;
              margin-top: 15px;
              cursor: pointer;
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
            <button onclick="returnToMainMenu()" class="btn-secondary">メインメニューに戻る</button>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
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
              cursor: pointer;
            }
            .btn-warning {
              background-color: #ffc107;
              color: #212529;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
              border: none;
              cursor: pointer;
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
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </div>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
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
    // Check if error is related to existing data in sheet
    if (
      processingError.message.includes("既に") &&
      processingError.message.includes("レコード")
    ) {
      // Get sheet information from error
      const errorMessage = processingError.message;

      // Create special error HTML notification for case where sheet already has data
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
              .btn-secondary {
                background-color: #6c757d;
                color: white;
                border: none;
                cursor: pointer;
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
                <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
              </div>
            </div>
            <script>
              function returnToMainMenu() {
                google.script.run
                  .withSuccessHandler(function(html) {
                    document.open();
                    document.write(html);
                    document.close();
                  })
                  .getMainMenu();
              }
            </script>
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
}

/**
 * Create HTML form for user input
 */
function createFormHtml() {
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <title>Google Docs から Google Sheets へのデータ抽出</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .submit-btn {
            background-color: #4285f4;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: block;
            margin: 20px auto;
          }
          .submit-btn:hover {
            background-color: #3367d6;
          }
          .submit-btn:disabled {
            background-color: #b3b3b3;
            cursor: not-allowed;
          }
          .instructions {
            background-color: #e8f0fe;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status-message {
            display: none;
            margin: 15px 0;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
          .status-message.processing {
            display: block;
            background-color: #e8f0fe;
            color: #174ea6;
          }
          .status-message.error {
            display: block;
            background-color: #fce8e6;
            color: #c5221f;
            border: 1px solid #fad2cf;
          }
          .status-message.success {
            display: block;
            background-color: #e6f4ea;
            color: #137333;
            border: 1px solid #ceead6;
          }
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          .btn-back {
            background-color: #6c757d;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-bottom: 20px;
            cursor: pointer;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <button onclick="returnToMainMenu()" class="btn-back">← メインメニューに戻る</button>
          <h1>Google Docs から Google Sheets へのデータ抽出</h1>
          
          <div class="instructions">
            <h3>使用方法：</h3>
            <p>Google DocsからGoogle Sheetsにヘッダーデータを抽出するには、以下の情報を入力してください。</p>
          </div>
          
          <form id="extractionForm" onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="docsId">Google Docs ID:</label>
              <input type="text" id="docsId" name="docsId" required>
              <div class="hint">例：1A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM (URLから取得できます)</div>
            </div>
            
            <div class="form-group">
              <label for="docsTabId">Docs タブ ID:</label>
              <input type="text" id="docsTabId" name="docsTabId" required>
              <div class="hint">Google Docsのタブ識別子</div>
            </div>
            
            <div class="form-group">
              <label for="sheetId">Google Sheets ID:</label>
              <input type="text" id="sheetId" name="sheetId" required>
              <div class="hint">例：1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms (URLから取得できます)</div>
            </div>
            
            <div id="statusMessage" class="status-message">
              <div class="spinner"></div>
              <span id="statusText">データを処理中...</span>
            </div>
            
            <button type="submit" class="submit-btn">抽出を実行</button>
          </form>
          
          <div class="footer">
            <p>IDの確認方法：URLの該当部分をコピーしてください。</p>
            <p>Google Docs URL例: <code>https://docs.google.com/document/d/<strong>ここがdocsId</strong>/edit...</code></p>
            <p>Google Sheets URL例: <code>https://docs.google.com/spreadsheets/d/<strong>ここがsheetId</strong>/edit...</code></p>
          </div>
        </div>
        
        <script>
          function returnToMainMenu() {
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .getMainMenu();
          }
          
          function handleSubmit(event) {
            event.preventDefault();
            const form = document.getElementById('extractionForm');
            const docsId = form.docsId.value.trim();
            const docsTabId = form.docsTabId.value.trim();
            const sheetId = form.sheetId.value.trim();
            
            // Validate form inputs
            if (!docsId || !docsTabId || !sheetId) {
              alert('すべてのフィールドを入力してください。');
              return false;
            }
            
            // Display values in console for debugging
            console.log("docsId:", docsId);
            console.log("docsTabId:", docsTabId);
            console.log("sheetId:", sheetId);
            
            // Show processing message
            const submitButton = document.querySelector('.submit-btn');
            submitButton.innerHTML = '処理中...';
            submitButton.disabled = true;
            
            // Display status message
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.className = 'status-message processing';
            document.getElementById('statusText').innerText = 'Google Docsからデータを抽出中...';
            
            // Option 1: Send form via google.script.run
            google.script.run
              .withSuccessHandler(function(html) {
                // Update status message
                statusMessage.className = 'status-message success';
                document.getElementById('statusText').innerText = '完了しました！結果ページに移動中...';
                
                // Add small delay so user can see success message
                setTimeout(function() {
                  // Replace entire page with result HTML
                  document.open();
                  document.write(html);
                  document.close();
                }, 1000);
              })
              .withFailureHandler(function(error) {
                // Update status message
                statusMessage.className = 'status-message error';
                document.getElementById('statusText').innerText = 'エラーが発生しました';
                
                // Restore submit button and display error
                submitButton.innerHTML = '抽出を実行';
                submitButton.disabled = false;
                alert('エラーが発生しました: ' + error);
                console.error(error);
              })
              .processForm({
                docsId: docsId,
                docsTabId: docsTabId,
                sheetId: sheetId
              });
            
            // Option 2: Use redirect URL as before (only use if option 1 doesn't work)
            /*
            const baseUrl = window.location.href.split('?')[0];
            const redirectUrl = baseUrl + 
              '?docsId=' + encodeURIComponent(docsId) + 
              '&docsTabId=' + encodeURIComponent(docsTabId) + 
              '&sheetId=' + encodeURIComponent(sheetId);
            
            console.log("Redirect URL:", redirectUrl);
            window.location.href = redirectUrl;
            */
            
            return false;
          }
        </script>
      </body>
    </html>
  `);

  return htmlOutput
    .setTitle("ヘッダー抽出ツール")
    .setFaviconUrl(
      "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Function to process form after submission
 */
function processForm(formObject) {
  try {
    // Get values from form
    const docsId = formObject.docsId;
    const docsTabId = formObject.docsTabId;
    const sheetId = formObject.sheetId;

    // Create a mock parameter object
    const e = {
      parameter: {
        docsId: docsId,
        docsTabId: docsTabId,
        sheetId: sheetId,
      },
    };

    // Use parameter processing function
    const htmlOutput = processWithParameters(e);

    // For Google Apps Script client-side, need to return HTML as string
    // instead of HtmlOutput object
    const htmlContent = htmlOutput.getContent();

    // Replace the return home button with the correct script call
    const updatedHtml = htmlContent.replace(
      /<a class="btn btn-secondary" href="\?" onclick="window\.location\.href = window\.location\.pathname; return false;">メインメニューに戻る<\/a>/g,
      '<button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>'
    );

    // Add the returnToMainMenu function
    const finalHtml = updatedHtml.replace(
      "</body>",
      `<script>
        function returnToMainMenu() {
          google.script.run
            .withSuccessHandler(function(html) {
              document.open();
              document.write(html);
              document.close();
            })
            .getMainMenu();
        }
      </script>
      </body>`
    );

    return finalHtml;
  } catch (error) {
    Logger.log("Form processing error: " + error);

    // Create an HTML error page
    const errorHtml = `
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
            .btn {
              display: inline-block;
              padding: 10px 15px;
              margin: 10px 5px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              border: none;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
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
            <p>
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </p>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
        </body>
      </html>
    `;

    return errorHtml;
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
  const recordCount = sheetValues.length - 1; // Number of records (excluding header)

  // Check if sheet already has data (excluding header)
  if (sheetValues.length > 1) {
    // Sheet already has data (excluding header)
    Logger.log(
      `The sheet already has ${recordCount} records. New data will not be written.`
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
      /^(Mutation|Query|アドミンの各ページ|ユーザーの各ページ|DB|CDK|RESTful)$/.test(
        text
      )
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

  // Replace existing conditional formatting rules for column E
  const newRules = [rule1, rule2, rule3, rule4, rule5, rule6];
  sheet.setConditionalFormatRules(newRules);
}

function createCheckboxToColumnH() {
  const options = ["選択", "フロントエンド", "サーバーサイド", "DB", "CDK"];
  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options)
    .setAllowInvalid(false)
    .build();

  return dataValidation;
}

function applyColorRulesToColumnH(sheet) {
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

  // Rule 5: If value is "CDK" (CDK) then fill with light orange
  const rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("CDK")
    .setBackground("#fcaf33")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Replace existing conditional formatting rules for column H
  const newRules = [rule1, rule2, rule3, rule4, rule5];
  sheet.setConditionalFormatRules(newRules);
}

/**
 * Check if input1 is a sub-heading of input2
 */
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

/**
 * Get label based on heading type
 */
function getLabelFromType(input) {
  const labels = {
    Mutation: "サーバーサイド",
    Query: "サーバーサイド",
    アドミンの各ページ: "フロントエンド",
    ユーザーの各ページ: "フロントエンド",
    DB: "DB",
    CDK: "CDK",
    RESTful: "サーバーサイド",
  };

  return labels[input] || "選択";
}

/**
 * Get task title prefix based on heading type
 */
function getPrefixTitleTask(input) {
  const labels = {
    Mutation: "[michibiku-server]",
    Query: "[michibiku-server]",
    アドミンの各ページ: "[michibiku-client]",
    ユーザーの各ページ: "[michibiku-client]",
    DB: "[michibiku-db]",
    CDK: "[michibiku-cdk]",
    RESTful: "[michibiku-server]",
  };

  return labels[input] || "[michibiku-task]";
}

/**
 * Create rich text value with hyperlink
 */
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

/**
 * Get template from repo
 */
function getTemplateFromRepo(token, owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const options = {
    method: "get",
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const content = JSON.parse(response.getContentText());
  return Utilities.newBlob(
    Utilities.base64Decode(content.content)
  ).getDataAsString();
}

/**
 * Insert link into section
 */
function insertLinkIntoSection(body, section, link) {
  // Split body into lines
  const lines = body.split("\n");
  // Find line containing section (e.g., ## リンク)
  const index = lines.findIndex((line) => line.trim() === section);
  if (index !== -1) {
    // Insert link after the section line
    lines.splice(index + 1, 0, link);
  }
  return lines.join("\n");
}

/**
 * Strip front matter
 */
function stripFrontMatter(content) {
  // Remove YAML frontmatter (part between first two ---)
  const parts = content.split("---");
  if (parts.length >= 3) {
    // parts[0]: '' (before first ---), parts[1]: YAML, parts[2]: markdown part after
    return parts.slice(2).join("---").trim();
  }
  return content.trim();
}

/**
 * Create issue with template
 */
function createIssueWithTemplate(token, owner, repo, title, body) {
  const payload = {
    title,
    body,
  };
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
    },
    payload: JSON.stringify(payload),
  };
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

  const response = UrlFetchApp.fetch(url, options);
  return response;
}

/**
 * Get Docs form HTML content for client-side navigation
 */
function getDocsForm() {
  const html = createFormHtml().getContent();
  return html;
}

/**
 * Get GitHub form HTML content for client-side navigation
 */
function getGithubForm() {
  const html = createGithubFormHtml().getContent();
  return html;
}

/**
 * Get main menu HTML content for client-side navigation
 */
function getMainMenu() {
  const html = createMainMenuHtml().getContent();
  return html;
}

/**
 * ========================================flow add item to github project kanban========================================
 */

/**
 * create issue
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} title - Issue title
 * @param {string} body - Issue body
 * @param {string} token - GitHub token
 * @returns {string} Issue node_id
 */
function createIssue(owner, repo, title, body, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  const payload = {
    title: title,
    body: body,
  };
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const issue = JSON.parse(response.getContentText());
  Logger.log(
    "Created issue: " +
      issue.number +
      ", id: " +
      issue.id +
      ", node_id: " +
      issue.node_id
  );
  return issue.node_id; // Cần node_id để add vào project v2
}

/**
 * add issue to project v2
 * @param {string} projectNodeId - Project node id
 * @param {string} issueNodeId - Issue node id
 * @param {string} token - GitHub token
 * @returns {string} Response
 */
function addIssueToProjectV2(projectNodeId, issueNodeId, token) {
  const url = "https://api.github.com/graphql";
  const mutation = `
    mutation {
      addProjectV2ItemById(
        input: {
          projectId: "${projectNodeId}",
          contentId: "${issueNodeId}"
        }
      ) {
        item {
          id
        }
      }
    }`;
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "bearer " + token,
      Accept: "application/vnd.github+json",
    },
    payload: JSON.stringify({ query: mutation }),
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  return response;
}

function createIssueAndAddToProjectV2(
  owner,
  repo,
  title,
  body,
  projectNodeId,
  token
) {
  // 1. Tạo mới issue
  const issueNodeId = createIssue(owner, repo, title, body, token);

  // 2. Add vào project v2
  addIssueToProjectV2(projectNodeId, issueNodeId, token);
}

/**
 * Create Project form HTML
 */
function createProjectFormHtml() {
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <title>GitHub Projectにタスクを追加</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .submit-btn {
            background-color: #6f42c1;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: block;
            margin: 20px auto;
          }
          .submit-btn:hover {
            background-color: #5a32a3;
          }
          .submit-btn:disabled {
            background-color: #b3b3b3;
            cursor: not-allowed;
          }
          .instructions {
            background-color: #e8f0fe;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status-message {
            display: none;
            margin: 15px 0;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
          .status-message.processing {
            display: block;
            background-color: #e8f0fe;
            color: #174ea6;
          }
          .status-message.error {
            display: block;
            background-color: #fce8e6;
            color: #c5221f;
            border: 1px solid #fad2cf;
          }
          .status-message.success {
            display: block;
            background-color: #e6f4ea;
            color: #137333;
            border: 1px solid #ceead6;
          }
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          .btn-back {
            background-color: #6c757d;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-bottom: 20px;
            cursor: pointer;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <button onclick="returnToMainMenu()" class="btn-back">← メインメニューに戻る</button>
          <h1>GitHub Projectにタスクを追加</h1>
          
          <div class="instructions">
            <h3>使用方法：</h3>
            <p>Google Sheetsのデータから「ステータス」が「対応中」のタスクのみをGitHub Issueとして作成し、Projectに追加します。</p>
          </div>
          
          <form id="projectForm" onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="spreadsheetId">Google Spreadsheet ID:</label>
              <input type="text" id="spreadsheetId" name="spreadsheetId" required>
              <div class="hint">例：1gPoVdBm0sc3FyEK7aJJmpZli44Gzt-de8EcZUu-0GCE (URLから取得できます)</div>
            </div>
            
            <div class="form-group">
              <label for="sheetName">Sheet名:</label>
              <input type="text" id="sheetName" name="sheetName" required>
              <div class="hint">例：Sheet1</div>
            </div>
            
            <div class="form-group">
              <label for="githubToken">GitHub Token:</label>
              <input type="text" id="githubToken" name="githubToken" required>
              <div class="hint">GitHubの個人アクセストークン (PAT)</div>
            </div>
            
            <div class="form-group">
              <label for="owner">リポジトリ所有者:</label>
              <input type="text" id="owner" name="owner" required>
              <div class="hint">例：octocat</div>
            </div>
            
            <div class="form-group">
              <label for="repo">リポジトリ名:</label>
              <input type="text" id="repo" name="repo" required>
              <div class="hint">例：hello-world</div>
            </div>
            
            <div class="form-group">
              <label for="projectNodeId">Project Node ID:</label>
              <input type="text" id="projectNodeId" name="projectNodeId" required>
              <div class="hint">GitHubのProject IDはGraphQL APIで使用される一意の識別子です。例：PVT_kwDOC-v3Uc4AyplN</div>
            </div>
            
            <div id="statusMessage" class="status-message">
              <div class="spinner"></div>
              <span id="statusText">処理中...</span>
            </div>
            
            <button type="submit" class="submit-btn">Projectにタスクを追加</button>
          </form>
          
          <div class="footer">
            <p>注意：GitHub Projectにタスクを追加するには、適切な権限を持つGitHub Tokenが必要です。</p>
          </div>
        </div>
        
        <script>
          function returnToMainMenu() {
            google.script.run
              .withSuccessHandler(function(html) {
                document.open();
                document.write(html);
                document.close();
              })
              .getMainMenu();
          }
        
          function handleSubmit(event) {
            event.preventDefault();
            const form = document.getElementById('projectForm');
            const spreadsheetId = form.spreadsheetId.value.trim();
            const sheetName = form.sheetName.value.trim();
            const githubToken = form.githubToken.value.trim();
            const owner = form.owner.value.trim();
            const repo = form.repo.value.trim();
            const projectNodeId = form.projectNodeId.value.trim();
            
            // Validate form inputs
            if (!spreadsheetId || !sheetName || !githubToken || !owner || !repo || !projectNodeId) {
              alert('すべてのフィールドを入力してください。');
              return false;
            }
            
            // Show processing message
            const submitButton = document.querySelector('.submit-btn');
            submitButton.innerHTML = '処理中...';
            submitButton.disabled = true;
            
            // Display status message
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.className = 'status-message processing';
            document.getElementById('statusText').innerText = 'タスクをProjectに追加中...';
            
            // Send form via google.script.run
            google.script.run
              .withSuccessHandler(function(html) {
                // Update status message
                statusMessage.className = 'status-message success';
                document.getElementById('statusText').innerText = '完了しました！結果ページに移動中...';
                
                // Add small delay so user can see success message
                setTimeout(function() {
                  // Replace entire page with result HTML
                  document.open();
                  document.write(html);
                  document.close();
                }, 1000);
              })
              .withFailureHandler(function(error) {
                // Update status message
                statusMessage.className = 'status-message error';
                document.getElementById('statusText').innerText = 'エラーが発生しました';
                
                // Restore submit button and display error
                submitButton.innerHTML = 'Projectにタスクを追加';
                submitButton.disabled = false;
                alert('エラーが発生しました: ' + error);
                console.error(error);
              })
              .processProjectForm({
                spreadsheetId: spreadsheetId,
                sheetName: sheetName,
                githubToken: githubToken,
                owner: owner,
                repo: repo,
                projectNodeId: projectNodeId
              });
            
            return false;
          }
        </script>
      </body>
    </html>
  `);

  return htmlOutput
    .setTitle("GitHub Projectにタスクを追加")
    .setFaviconUrl(
      "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Process the project form submission
 */
function processProjectForm(formObject) {
  try {
    // Get values from form
    const spreadsheetId = formObject.spreadsheetId;
    const sheetName = formObject.sheetName;
    const githubToken = formObject.githubToken;
    const owner = formObject.owner;
    const repo = formObject.repo;
    const projectNodeId = formObject.projectNodeId;

    // Process tasks and add to project
    const result = processTasksAndAddToProject(
      spreadsheetId,
      sheetName,
      githubToken,
      owner,
      repo,
      projectNodeId
    );

    // Create HTML result to display
    const htmlOutput = `
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
            .warning {
              color: #856404;
              background-color: #fff3cd;
              border: 1px solid #ffeeba;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              text-align: left;
            }
            .info-box {
              color: #0c5460;
              background-color: #d1ecf1;
              border: 1px solid #bee5eb;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              text-align: left;
            }
            .container {
              max-width: 700px;
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
              background-color: #6f42c1;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              border: none;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
            .results {
              text-align: left;
              margin: 20px 0;
              max-height: 300px;
              overflow-y: auto;
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #ddd;
            }
            .issue-item {
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #eee;
            }
            .issue-number {
              font-weight: bold;
              color: #0366d6;
            }
            .project-badge {
              display: inline-block;
              background-color: #6f42c1;
              color: white;
              font-size: 12px;
              padding: 3px 8px;
              border-radius: 10px;
              margin-left: 8px;
              vertical-align: middle;
            }
            .error-section {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              border-radius: 4px;
              padding: 10px 15px;
              margin-top: 15px;
            }
            .error-item {
              color: #721c24;
              margin: 5px 0;
            }
            .summary {
              margin-top: 15px;
              padding: 10px;
              background-color: #f0f0f0;
              border-radius: 4px;
              text-align: center;
              font-weight: bold;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 15px 0;
              text-align: center;
            }
            .stat-item {
              padding: 10px;
              border-radius: 4px;
              min-width: 120px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin: 5px 0;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            .created {
              background-color: #e6f4ea;
              color: #137333;
            }
            .skipped {
              background-color: #e8eaed;
              color: #5f6368;
            }
            .errors {
              background-color: #fce8e6;
              color: #c5221f;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="success">✅ タスクの処理が完了しました！</h2>
            <p>Google Sheetsの行からGitHub Issuesが作成され、Projectに追加されました。</p>
            <p>スプレッドシートID: ${spreadsheetId}</p>
            <p>シート名: ${sheetName}</p>
            <p>リポジトリ: ${owner}/${repo}</p>
            <p>Project ID: ${projectNodeId}</p>
            
            <div class="stats">
              <div class="stat-item created">
                <div class="stat-value">${result.issuesCreated.length}</div>
                <div class="stat-label">作成・追加されたIssue</div>
              </div>
              <div class="stat-item skipped">
                <div class="stat-value">${result.skipped || 0}</div>
                <div class="stat-label">スキップされた行</div>
              </div>
              <div class="stat-item errors">
                <div class="stat-value">${result.errors.length}</div>
                <div class="stat-label">エラー</div>
              </div>
            </div>
            
            <div class="results">
              <h3>作成されたIssues:</h3>
              ${
                result.issuesCreated.length > 0
                  ? `
                <div class="summary">${
                  result.issuesCreated.length
                }件のIssueが作成されプロジェクトに追加されました</div>
                ${result.issuesCreated
                  .map(
                    (issue) =>
                      `<div class="issue-item">
                    <span class="issue-number">#${issue.number}</span> - 
                    <a href="${issue.html_url}" target="_blank">${issue.title}</a>
                    <span class="project-badge">Projectに追加済み</span>
                  </div>`
                  )
                  .join("")}
                `
                  : `<p>新しく作成されたIssueはありません。</p>`
              }
              
              ${
                result.skipped > 0
                  ? `<div class="info-box" style="margin-top: 15px;">
                <p><strong>ℹ️ 情報:</strong> ${result.skipped}行はステータスが「対応中」ではないためスキップされました。</p>
              </div>`
                  : ""
              }
              
              ${
                result.errors.length > 0
                  ? `<div class="error-section">
                <h3>エラー:</h3>
                ${result.errors
                  .map(
                    (error) =>
                      `<div class="error-item">
                    ${error}
                  </div>`
                  )
                  .join("")}
                </div>`
                  : ""
              }
            </div>
            
            <div>
              <a class="btn" href="https://github.com/${owner}/${repo}/issues" target="_blank">GitHubでIssuesを表示</a>
              <a class="btn" href="https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0" target="_blank">スプレッドシートを表示</a>
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </div>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
        </body>
      </html>
    `;

    return htmlOutput;
  } catch (error) {
    Logger.log("Project form processing error: " + error);

    // Create an HTML error page
    const errorHtml = `
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
            .btn {
              display: inline-block;
              padding: 10px 15px;
              margin: 10px 5px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              cursor: pointer;
              border: none;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラーが発生しました！</h2>
            <p>GitHub IssuesのProjectへの追加中にエラーが発生しました。</p>
            <p>エラーの詳細：</p>
            <div style="text-align: left; background-color: #ffe6e6; padding: 10px; border-radius: 5px; margin-top: 10px;">
              <code>${error.toString()}</code>
            </div>
            <p>
              <button class="btn btn-secondary" onclick="returnToMainMenu()">メインメニューに戻る</button>
            </p>
          </div>
          <script>
            function returnToMainMenu() {
              google.script.run
                .withSuccessHandler(function(html) {
                  document.open();
                  document.write(html);
                  document.close();
                })
                .getMainMenu();
            }
          </script>
        </body>
      </html>
    `;

    return errorHtml;
  }
}

/**
 * Process tasks and add to project
 * @param {string} spreadsheetId - ID of the Google Spreadsheet
 * @param {string} sheetName - Sheet name
 * @param {string} githubToken - GitHub token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} projectNodeId - Project node ID
 * @returns {Object} Result with issues created, skipped, and errors
 */
function processTasksAndAddToProject(
  spreadsheetId,
  sheetName,
  githubToken,
  owner,
  repo,
  projectNodeId
) {
  // Get sheet from id
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  // Find index of columns
  const header = data[0];
  const itemIndex = header.indexOf("項目");
  const statusIndex = header.indexOf("ステータス");
  const issueColumnIndex = header.indexOf("Issue");

  if (itemIndex < 0 || statusIndex < 0 || issueColumnIndex < 0) {
    throw new Error(
      'Column "項目" or "ステータス" or "Issue" not found in the sheet'
    );
  }

  // Track results
  const result = {
    issuesCreated: [],
    errors: [],
    skipped: 0,
  };

  // Log header information for debugging
  Logger.log(
    `Found columns - 項目: ${itemIndex}, ステータス: ${statusIndex}, Issue: ${issueColumnIndex}`
  );

  // Get all the possible values for the "ステータス" dropdown
  // This is optional but helps in debugging
  try {
    const statusCell = sheet.getRange(2, statusIndex + 1); // +1 because getRange is 1-indexed
    const statusValidation = statusCell.getDataValidation();
    if (statusValidation) {
      const criteria = statusValidation.getCriteriaType();
      if (criteria === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
        const validValues = statusValidation.getCriteriaValues();
        Logger.log(`Valid status values: ${JSON.stringify(validValues)}`);
      }
    }
  } catch (e) {
    Logger.log(`Could not get dropdown values: ${e}`);
  }

  // Loop through each row (skip header)
  for (let i = 1; i < data.length; i++) {
    const existingIssue = data[i][issueColumnIndex];
    const issueTitle = `${existingIssue} ${data[i][itemIndex]}`;
    const status = String(data[i][statusIndex] || "").trim(); // Convert to string and trim

    // Log the actual status value for debugging
    Logger.log(`Row ${i + 1} - Status: "${status}", Type: ${typeof status}`);

    // Skip if no title
    if (!issueTitle) {
      Logger.log(`Skipping row ${i + 1} - Missing title or link`);
      result.skipped++;
      continue;
    }

    // Check if status is "対応中" (In Progress) - use includes for more flexible matching
    if (status !== "対応中" && status.indexOf("対応中") === -1) {
      Logger.log(
        `Skipping row ${i + 1} as status is not "対応中": "${status}"`
      );
      result.skipped++;
      continue;
    }

    try {
      const issueBody = `## N/A`;

      Logger.log(`Creating issue for row ${i + 1}: "${issueTitle}"`);

      // Create issue and add to project
      const issueNodeId = createIssue(
        owner,
        repo,
        issueTitle,
        issueBody,
        githubToken
      );

      // Add to project
      const projectResponse = addIssueToProjectV2(
        projectNodeId,
        issueNodeId,
        githubToken
      );

      // Get issue number from node ID (extract from response)
      const responseText = projectResponse.getContentText();
      const responseJson = JSON.parse(responseText);

      // Make a separate call to get issue details by searching latest issues
      const issueDetails = getLatestIssue(owner, repo, githubToken);

      // Update the sheet with the issue number
      if (issueDetails) {
        createGithubIssueLink(owner, repo, issueDetails.number);

        // Add to results
        result.issuesCreated.push({
          title: issueDetails.title,
          number: issueDetails.number,
          html_url: issueDetails.html_url,
          rowIndex: i + 1,
        });

        Logger.log(
          `Created issue #${issueDetails.number} and added to project: ${issueTitle}`
        );
      } else {
        Logger.log(
          `Issue created but couldn't retrieve details for row ${i + 1}`
        );
      }
    } catch (e) {
      // Log error and add to results
      Logger.log("Error creating issue: " + issueTitle + " - " + e);
      result.errors.push("Issue '" + issueTitle + "': " + e.toString());
    }
  }

  return result;
}

/**
 * Get latest issue from repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub token
 * @returns {Object} Issue details
 */
function getLatestIssue(owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?per_page=1`;
  const options = {
    method: "get",
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
    },
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) {
      const issues = JSON.parse(response.getContentText());
      if (issues && issues.length > 0) {
        return issues[0];
      }
    }
    return null;
  } catch (e) {
    Logger.log("Error getting latest issue: " + e);
    return null;
  }
}

/**
 * Get Project form HTML content for client-side navigation
 */
function getProjectForm() {
  const html = createProjectFormHtml().getContent();
  return html;
}
