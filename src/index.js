Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        document.getElementById("highlight-spam").onclick = highlightSpamTerms;
    }
});

async function getSpamTerms() {
    try {
        const response = await fetch('https://localhost:3000/api/spam-terms');
        const data = await response.json();
        return data.spamTerms;
    } catch (error) {
        console.error('Error fetching spam terms:', error);
        return [];
    }
}

async function highlightSpamTerms() {
    try {
        const statusElement = document.getElementById("status");
        const spamTermsElement = document.getElementById("spam-terms-found");
        
        statusElement.innerHTML = "Scanning email...";
        
        // Get spam terms from our mock API
        const spamTerms = await getSpamTerms();
        
        // Get the current email item
        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, async (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const emailContent = result.value;
                const foundTerms = new Set();
                
                // Check for spam terms in the email content
                spamTerms.forEach(term => {
                    if (emailContent.toLowerCase().includes(term.toLowerCase())) {
                        foundTerms.add(term);
                    }
                });
                
                // Display results
                if (foundTerms.size > 0) {
                    spamTermsElement.innerHTML = `<div class="warning">
                        Potential spam terms found: ${Array.from(foundTerms).join(", ")}
                    </div>`;
                    
                    // Highlight terms in the email
                    const highlightedContent = emailContent.replace(
                        new RegExp(Array.from(foundTerms).join("|"), "gi"),
                        match => `<mark>${match}</mark>`
                    );
                    
                    Office.context.mailbox.item.body.setAsync(
                        highlightedContent,
                        { coercionType: Office.CoercionType.Html },
                        (result) => {
                            if (result.status === Office.AsyncResultStatus.Failed) {
                                statusElement.innerHTML = `Error highlighting terms: ${result.error.message}`;
                            } else {
                                statusElement.innerHTML = "Scan complete!";
                            }
                        }
                    );
                } else {
                    spamTermsElement.innerHTML = "No spam terms detected";
                    statusElement.innerHTML = "Scan complete!";
                }
            } else {
                statusElement.innerHTML = `Error reading email: ${result.error.message}`;
            }
        });
    } catch (error) {
        document.getElementById("status").innerHTML = `Error: ${error.message}`;
    }
}
