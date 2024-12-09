Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        document.getElementById("highlight-spam").onclick = analyzeEmail;
    }
});

async function analyzeEmail() {
    try {
        const statusElement = document.getElementById("status");
        const spamTermsElement = document.getElementById("spam-terms-found");
        
        statusElement.innerHTML = "Analyzing email...";
        
        // Get the current email item
        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, async (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const emailContent = result.value;
                
                // Analyze text for spam
                const response = await fetch('https://localhost:3000/api/analyze-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: emailContent })
                });
                
                const analysis = await response.json();
                
                // Display results
                if (analysis.isSpam) {
                    spamTermsElement.innerHTML = `
                        <div class="warning">
                            <h4>⚠️ Potential Spam Detected</h4>
                            <p>Confidence Score: ${(analysis.spamConfidenceScore * 100).toFixed(1)}%</p>
                            ${analysis.analysis.SpamTriggers ? 
                                `<p>Triggers: ${analysis.analysis.SpamTriggers.join(", ")}</p>` : 
                                ''}
                        </div>`;
                    
                    // Highlight suspicious content if available
                    if (analysis.analysis.SpamTriggers) {
                        const highlightedContent = emailContent.replace(
                            new RegExp(analysis.analysis.SpamTriggers.join("|"), "gi"),
                            match => `<mark>${match}</mark>`
                        );
                        
                        Office.context.mailbox.item.body.setAsync(
                            highlightedContent,
                            { coercionType: Office.CoercionType.Html },
                            (result) => {
                                if (result.status === Office.AsyncResultStatus.Failed) {
                                    statusElement.innerHTML = `Error highlighting content: ${result.error.message}`;
                                } else {
                                    statusElement.innerHTML = "Analysis complete!";
                                }
                            }
                        );
                    }
                } else {
                    spamTermsElement.innerHTML = `
                        <div class="safe">
                            <h4>✅ No Spam Detected</h4>
                            <p>Confidence Score: ${(analysis.spamConfidenceScore * 100).toFixed(1)}%</p>
                        </div>`;
                    statusElement.innerHTML = "Analysis complete!";
                }
            } else {
                statusElement.innerHTML = `Error reading email: ${result.error.message}`;
            }
        });
    } catch (error) {
        document.getElementById("status").innerHTML = `Error: ${error.message}`;
    }
}
