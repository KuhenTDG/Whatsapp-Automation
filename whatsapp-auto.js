/*const { chromium } = require('playwright'); // import Playwright
const readline = require('readline');

// ====== CONFIGURATION ======
const contactName = "Whatsapp Automation";  // Change as needed
const message = "kuhentest";
// ===========================

// Function to wait for user input (QR scan)
const waitForEnter = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Scan the QR code in the browser, then press ENTER here to continue... ", () => {
      rl.close();
      resolve();
    });
  });
};

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext(); // No storage yet
  const page = await context.newPage();

  // Open WhatsApp Web
  await page.goto('https://web.whatsapp.com');

  // Ask user to scan QR code manually
  await waitForEnter();

  try {
    // Wait and focus the search bar
    await page.waitForSelector('div[contenteditable="true"][data-tab="3"]', { timeout: 60000 });
    const searchBox = await page.$('div[contenteditable="true"][data-tab="3"]');
    await searchBox.click();
    await searchBox.type(contactName, { delay: 100 });

    // Wait for contact to appear and click it
    await page.waitForSelector(`span[title="${contactName}"]`, { timeout: 15000 });
    const contact = await page.$(`span[title="${contactName}"]`);
    await contact.click();
    console.log(`✅ Contact '${contactName}' found and opened!`);

    // Wait for message box and type message
    await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
    const messageBox = await page.$('div[contenteditable="true"][data-tab="10"]');
    await messageBox.type(message);
    await messageBox.press('Enter');

    console.log("✅ Message sent successfully!");
  } catch (err) {
    console.error("❌ Error: ", err);
  }

  // Wait for the "Proceed" button to appear and click it
    try {
        console.log("⏳ Waiting for Proceed button to appear...");
        const proceedButton = await page.getByRole('button', { name: 'Proceed' }).nth(2);
        await proceedButton.waitFor({ timeout: 50000 }); // wait up to 10 seconds
        await proceedButton.click()
        console.log("✅ Proceed button clicked");


      // Wait for the prompt to enter name
      console.log("⏳ Waiting to enter name...");
      await page.waitForTimeout(50000); // Simulate user thinking delay
      const nameBox = await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
      await nameBox.type("Kuhenraj", { delay: 120 }); // Adjust name and delay as needed
      await nameBox.press('Enter');
      console.log("✅ Name entered successfully!");
    } catch (e) {
      console.error("❌ Failed to proceed or enter name: ", e);
    }

  // Keep browser open for 10s
  //page.waitForTimeout(10000);
  //await browser.close();

})(); */

/*
// merged-playwright-whatsapp.js
const { chromium } = require('playwright');
const readline = require('readline');

// ====== CONFIGURATION ======
const contactName = "Whatsapp Automation";  // Change as needed
const message = "kuhentest";
const imagePath = 'Image.jpg'; // if you want to send image later
// ============================

const waitForEnter = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Scan the QR code in the browser, then press ENTER here to continue... ", () => {
      rl.close();
      resolve();
    });
  });
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://web.whatsapp.com');
  await waitForEnter();

  try {
    // Click search
    await page.locator('.x10l6tqk > div').first().click();

    // Type contact name
    await page.getByRole('textbox', { name: 'Search input textbox' }).getByRole('paragraph').click();
    await page.getByRole('textbox', { name: 'Search input textbox' }).fill(contactName);

    // Click the contact
    await page.getByRole('button', { name: new RegExp(contactName, 'i') }).click();
    console.log(`✅ Contact '${contactName}' found and opened!`);

    // Type and send message
    const msgBox = page.getByRole('textbox', { name: 'Type a message' }).getByRole('paragraph');
    await msgBox.click();
    await msgBox.fill(message);
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    console.log("✅ Message sent successfully!");

    // Optional: Send an image
    if (imagePath) {
      await page.getByRole('button', { name: 'Attach' }).click();
      await page.getByRole('button', { name: 'Photos & videos' }).click();
      await page.getByRole('application').setInputFiles(imagePath);
      await page.getByRole('button', { name: 'Send', exact: true }).click();
      console.log("📷 Image sent successfully!");
    }

  } catch (err) {
    console.error("❌ Error:", err);
  }

  // await browser.close(); // keep browser open
})();

*/


/*const { chromium } = require('playwright'); // import Playwright
const readline = require('readline');

// ====== CONFIGURATION ======
const contactName = "Whatsapp Automation";  // Change as needed
const message = "kuhentest";
// ===========================

// Function to wait for user input (QR scan)
const waitForEnter = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Scan the QR code in the browser, then press ENTER here to continue... ", () => {
      rl.close();
      resolve();
    });
  });
};

// Helper function to try multiple selectors for the Proceed button
const clickProceedButton = async (page) => {
  const selectors = [
    // Try different possible selectors for the Proceed button
    'button:has-text("Proceed")',
    'button[aria-label*="Proceed"]',
    '[role="button"]:has-text("Proceed")',
    'div[role="button"]:has-text("Proceed")',
    'span:has-text("Proceed")',
    '.proceed-button',
    '[data-testid*="proceed"]',
    // Generic button selectors that might contain "Proceed"
    'button',
    '[role="button"]'
  ];

  console.log("🔍 Trying different selectors for Proceed button...");

  for (const selector of selectors) {
    try {
      console.log(`   Trying selector: ${selector}`);
      
      if (selector === 'button' || selector === '[role="button"]') {
        // For generic selectors, find all buttons and check text content
        const buttons = await page.$$(selector);
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && text.toLowerCase().includes('proceed')) {
            console.log(`   ✅ Found Proceed button with text: "${text}"`);
            await button.click();
            return true;
          }
        }
      } else {
        // For specific selectors, try direct approach
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            console.log(`   ✅ Found visible Proceed button with selector: ${selector}`);
            await element.click();
            return true;
          }
        }
      }
    } catch (error) {
      // Continue to next selector if this one fails
      console.log(`   ❌ Selector ${selector} failed: ${error.message}`);
      continue;
    }
  }
  
  return false;
};

// Helper function to wait and click proceed with multiple strategies
const waitAndClickProceed = async (page, maxWaitTime = 60000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      // First, check if we're in an iframe (some WhatsApp campaigns load in iframes)
      const frames = await page.frames();
      
      // Try in main page first
      console.log("🔍 Searching for Proceed button in main page...");
      if (await clickProceedButton(page)) {
        return true;
      }
      
      // Try in each iframe
      for (const frame of frames) {
        if (frame !== page.mainFrame()) {
          console.log("🔍 Searching for Proceed button in iframe...");
          try {
            if (await clickProceedButton(frame)) {
              return true;
            }
          } catch (error) {
            console.log(`   ❌ Error in iframe: ${error.message}`);
          }
        }
      }
      
      // Wait a bit before trying again
      await page.waitForTimeout(2000);
      console.log("⏳ Proceed button not found yet, retrying...");
      
    } catch (error) {
      console.log(`❌ Error while searching for Proceed button: ${error.message}`);
    }
  }
  
  return false;
};

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext(); // No storage yet
  const page = await context.newPage();

  // Open WhatsApp Web
  await page.goto('https://web.whatsapp.com');

  // Ask user to scan QR code manually
  await waitForEnter();

  try {
    // Wait and focus the search bar
    await page.waitForSelector('div[contenteditable="true"][data-tab="3"]', { timeout: 60000 });
    const searchBox = await page.$('div[contenteditable="true"][data-tab="3"]');
    await searchBox.click();
    await searchBox.type(contactName, { delay: 100 });

    // Wait for contact to appear and click it
    await page.waitForSelector(`span[title="${contactName}"]`, { timeout: 15000 });
    const contact = await page.$(`span[title="${contactName}"]`);
    await contact.click();
    console.log(`✅ Contact '${contactName}' found and opened!`);

    // Wait for message box and type message
    await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
    const messageBox = await page.$('div[contenteditable="true"][data-tab="10"]');
    await messageBox.type(message);
    await messageBox.press('Enter');

    console.log("✅ Message sent successfully!");
    
    // Wait a bit for the response
    await page.waitForTimeout(3000);
    
  } catch (err) {
    console.error("❌ Error in main flow: ", err);
  }

  // Wait for the "Proceed" button to appear and click it with improved logic
  try {
    console.log("⏳ Waiting for Proceed button to appear...");
    
    const success = await waitAndClickProceed(page, 60000); // Wait up to 60 seconds
    
    if (success) {
      console.log("✅ Proceed button clicked successfully!");
    } else {
      console.log("❌ Could not find or click Proceed button within timeout period");
      
      // Debug: Take a screenshot to see what's on screen
      await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });
      console.log("📸 Debug screenshot saved as 'debug_screenshot.png'");
      
      // Debug: Print all button-like elements
      console.log("🔍 Debug: All button-like elements found:");
      const allButtons = await page.$$eval('[role="button"], button', 
        buttons => buttons.map(btn => ({ 
          text: btn.textContent?.trim(), 
          className: btn.className,
          outerHTML: btn.outerHTML.substring(0, 200) + '...'
        }))
      );
      console.log(allButtons);
    }
    
  } catch (e) {
    console.error("❌ Failed to handle Proceed button: ", e);
  }

  console.log("🔄 Script completed. Browser will remain open for inspection.");
  
  // Keep browser open for inspection
  // Uncomment the lines below if you want to close automatically
  // await page.waitForTimeout(10000);
  // await browser.close();

})();*/

/*const { chromium } = require('playwright'); // import Playwright
const readline = require('readline');

// ====== CONFIGURATION ======
const contactName = "Whatsapp Automation";  // Change as needed
const message = "kuhentest";
// ===========================

// Function to wait for user input (QR scan)
const waitForEnter = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Scan the QR code in the browser, then press ENTER here to continue... ", () => {
      rl.close();
      resolve();
    });
  });
};

// Helper function to try multiple selectors for the Proceed button
const clickProceedButton = async (page) => {
  const selectors = [
    // Specific selector based on your HTML structure
    'div._ahef[role="button"]:has-text("Proceed")',
    'div._ahef[role="button"] span:has-text("Proceed")',
    'div._ahef[aria-disabled="false"]',
    // Alternative ways to target the same element
    'div[role="button"][tabindex="0"]:has-text("Proceed")',
    'div._ahed div._ahef',
    // Fallback selectors
    '[role="button"]:has-text("Proceed")',
    'div[role="button"]:has-text("Proceed")',
    'span:has-text("Proceed")',
    // Generic button selectors that might contain "Proceed"
    'button',
    '[role="button"]'
  ];

  console.log("🔍 Trying different selectors for Proceed button...");

  for (const selector of selectors) {
    try {
      console.log(`   Trying selector: ${selector}`);
      
      if (selector === 'button' || selector === '[role="button"]') {
        // For generic selectors, find all buttons and check text content
        const buttons = await page.$(selector);
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && text.toLowerCase().includes('proceed')) {
            console.log(`   ✅ Found Proceed button with text: "${text}"`);
            
            // Try multiple click methods for better success rate
            await tryMultipleClickMethods(page, button, text);
            return true;
          }
        }
      } else {
        // For specific selectors, try direct approach
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            console.log(`   ✅ Found visible Proceed button with selector: ${selector}`);
            
            // Try multiple click methods for better success rate
            await tryMultipleClickMethods(page, element, text);
            return true;
          }
        }
      }
    } catch (error) {
      // Continue to next selector if this one fails
      console.log(`   ❌ Selector ${selector} failed: ${error.message}`);
      continue;
    }
  }
  
  return false;
};

// Helper function to try different click methods
const tryMultipleClickMethods = async (page, element, buttonText) => {
  console.log(`🖱️ Trying different click methods on button: "${buttonText}"`);
  
  try {
    // Method 1: Scroll into view and wait
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Longer delay to ensure scrolling is complete
    
    // Method 2: Check if element is actually clickable
    const isEnabled = await element.getAttribute('aria-disabled');
    console.log(`   Button aria-disabled status: ${isEnabled}`);
    
    if (isEnabled === 'true') {
      console.log("⚠️ Button is disabled, waiting for it to be enabled...");
      // Wait for button to be enabled
      await page.waitForFunction(
        (el) => el.getAttribute('aria-disabled') !== 'true',
        element,
        { timeout: 10000 }
      );
    }
    
    // Method 3: Try clicking the parent div with class _ahef (the actual clickable element)
    console.log("   Trying to click the main button div (_ahef)...");
    await element.click({ force: true });
    await page.waitForTimeout(2000);
    
    // Method 4: Try clicking with coordinates on the center of the element
    console.log("   Trying coordinate-based click...");
    const box = await element.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(2000);
    }
    
    // Method 5: Try clicking the span inside (sometimes the span needs to be clicked)
    console.log("   Trying to click the span inside...");
    const spanElement = await element.$('span');
    if (spanElement) {
      await spanElement.click({ force: true });
      await page.waitForTimeout(2000);
    }
    
    // Method 6: Try JavaScript click on the main div
    console.log("   Trying JavaScript click...");
    await element.evaluate(el => {
      el.click();
    });
    await page.waitForTimeout(2000);
    
    // Method 7: Try dispatching mousedown and mouseup events
    console.log("   Trying mouse events...");
    await element.evaluate(el => {
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await page.waitForTimeout(2000);
    
    // Method 8: Try focus and Enter key
    console.log("   Trying focus and Enter key...");
    await element.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Method 9: Try focus and Space key
    console.log("   Trying focus and Space key...");
    await element.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);
    
    console.log("✅ All click methods attempted");
    
  } catch (error) {
    console.log(`❌ Error during click attempts: ${error.message}`);
  }
};

// Helper function to wait and click proceed with multiple strategies
const waitAndClickProceed = async (page, maxWaitTime = 60000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      // First try the specific selector based on your HTML structure
      console.log("🎯 Trying specific selector for your HTML structure...");
      
      // Look for the exact div with class _ahef that has role="button"
      const specificButton = await page.$('div._ahef[role="button"][aria-disabled="false"]');
      if (specificButton) {
        const text = await specificButton.textContent();
        if (text && text.includes('Proceed')) {
          console.log(`✅ Found specific Proceed button with structure: div._ahef`);
          await tryMultipleClickMethods(page, specificButton, text);
          return true;
        }
      }
      
      // Try alternative specific selector
      const altButton = await page.$('div._ahed div._ahef[role="button"]');
      if (altButton) {
        const text = await altButton.textContent();
        if (text && text.includes('Proceed')) {
          console.log(`✅ Found Proceed button with full structure: div._ahed > div._ahef`);
          await tryMultipleClickMethods(page, altButton, text);
          return true;
        }
      }
      
      // Check if we're in an iframe (some WhatsApp campaigns load in iframes)
      const frames = await page.frames();
      
      // Try in main page with generic approach
      console.log("🔍 Trying generic approach in main page...");
      if (await clickProceedButton(page)) {
        return true;
      }
      
      // Try in each iframe
      for (const frame of frames) {
        if (frame !== page.mainFrame()) {
          console.log("🔍 Searching for Proceed button in iframe...");
          try {
            // Try specific selector in iframe
            const iframeSpecificButton = await frame.$('div._ahef[role="button"][aria-disabled="false"]');
            if (iframeSpecificButton) {
              const text = await iframeSpecificButton.textContent();
              if (text && text.includes('Proceed')) {
                console.log(`✅ Found specific Proceed button in iframe`);
                await tryMultipleClickMethods(frame, iframeSpecificButton, text);
                return true;
              }
            }
            
            // Try generic approach in iframe
            if (await clickProceedButton(frame)) {
              return true;
            }
          } catch (error) {
            console.log(`   ❌ Error in iframe: ${error.message}`);
          }
        }
      }
      
      // Wait a bit before trying again
      await page.waitForTimeout(2000);
      console.log("⏳ Proceed button not found yet, retrying...");
      
    } catch (error) {
      console.log(`❌ Error while searching for Proceed button: ${error.message}`);
    }
  }
  
  return false;
};

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext(); // No storage yet
  const page = await context.newPage();

  // Open WhatsApp Web
  await page.goto('https://web.whatsapp.com');

  // Ask user to scan QR code manually
  await waitForEnter();

  try {
    // Wait and focus the search bar
    await page.waitForSelector('div[contenteditable="true"][data-tab="3"]', { timeout: 60000 });
    const searchBox = await page.$('div[contenteditable="true"][data-tab="3"]');
    await searchBox.click();
    await searchBox.type(contactName, { delay: 100 });

    // Wait for contact to appear and click it
    await page.waitForSelector(`span[title="${contactName}"]`, { timeout: 15000 });
    const contact = await page.$(`span[title="${contactName}"]`);
    await contact.click();
    console.log(`✅ Contact '${contactName}' found and opened!`);

    // Wait for message box and type message
    await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
    const messageBox = await page.$('div[contenteditable="true"][data-tab="10"]');
    await messageBox.type(message);
    await messageBox.press('Enter');

    console.log("✅ Message sent successfully!");
    
    // Wait a bit for the response
    await page.waitForTimeout(3000);
    
  } catch (err) {
    console.error("❌ Error in main flow: ", err);
  }

  // Wait for the "Proceed" button to appear and click it with improved logic
  try {
    console.log("⏳ Waiting for Proceed button to appear...");
    
    // Take a screenshot before attempting to click
    await page.screenshot({ path: 'before_click_screenshot.png', fullPage: true });
    console.log("📸 Screenshot before clicking saved as 'before_click_screenshot.png'");
    
    const success = await waitAndClickProceed(page, 60000); // Wait up to 60 seconds
    
    if (success) {
      console.log("✅ Proceed button click attempts completed!");
      
      // Wait a moment and take another screenshot to verify the click worked
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'after_click_screenshot.png', fullPage: true });
      console.log("📸 Screenshot after clicking saved as 'after_click_screenshot.png'");
      
      // Try to verify if the click worked by checking if the button is still there
      const buttonStillExists = await page.$('button:has-text("Proceed"), [role="button"]:has-text("Proceed")');
      if (!buttonStillExists) {
        console.log("🎉 SUCCESS: Proceed button disappeared - click likely worked!");
      } else {
        console.log("⚠️  WARNING: Proceed button still visible - click might not have worked");
        console.log("💡 MANUAL ACTION REQUIRED: Please check the screenshots and try clicking manually");
      }
      
    } else {
      console.log("❌ Could not find Proceed button within timeout period");
      
      // Debug: Take a screenshot to see what's on screen
      await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });
      console.log("📸 Debug screenshot saved as 'debug_screenshot.png'");
      
      // Debug: Print all button-like elements
      console.log("🔍 Debug: All button-like elements found:");
      const allButtons = await page.$eval('[role="button"], button', 
        buttons => buttons.map(btn => ({ 
          text: btn.textContent?.trim(), 
          className: btn.className,
          outerHTML: btn.outerHTML.substring(0, 200) + '...'
        }))
      );
      console.log(allButtons);
    }
    
  } catch (e) {
    console.error("❌ Failed to handle Proceed button: ", e);
  }

  console.log("🔄 Script completed. Browser will remain open for inspection.");
  
  // Keep browser open for inspection
  // Uncomment the lines below if you want to close automatically
  // await page.waitForTimeout(10000);
  // await browser.close();

})();*/

const { chromium } = require('playwright');
const readline = require('readline');

// ====== CONFIGURATION ======
const contactName = "Whatsapp Automation";
const message = "kuhentest";
// ===========================

const waitForEnter = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Scan the QR code in the browser, then press ENTER here to continue... ", () => {
      rl.close();
      resolve();
    });
  });
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://web.whatsapp.com');
  await waitForEnter();

  try {
    // Find and click contact
    await page.waitForSelector('div[contenteditable="true"][data-tab="3"]', { timeout: 60000 });
    const searchBox = await page.$('div[contenteditable="true"][data-tab="3"]');
    await searchBox.click();
    await searchBox.type(contactName, { delay: 100 });

    await page.waitForSelector(`span[title="${contactName}"]`, { timeout: 15000 });
    const contact = await page.$(`span[title="${contactName}"]`);
    await contact.click();
    console.log(`> Contact found and opened!`);

    // Send message
    await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 10000 });
    const messageBox = await page.$('div[contenteditable="true"][data-tab="10"]');
    await messageBox.type(message, { delay: 100 });
    await messageBox.press('Enter');
    console.log("> Keyword sent!");
    
    await page.waitForTimeout(5000); // Wait longer for response
    
  } catch (err) {
    console.error("Error: ", err);
  }

  // Click Proceed button - SIMPLIFIED VERSION
  try {
    console.log("> Looking for Proceed button...");
    
    // Wait for the exact button structure you found
    await page.waitForSelector('div._ahef[role="button"]:has-text("Proceed")', { timeout: 30000 });
    
    // Click it using the exact CSS classes
    await page.click('div._ahef[role="button"]:has-text("Proceed")');
    console.log("> Clicked the _ahef button!");

    // Wait with countdown before typing name
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds

  // Wait for message box
  await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 30000 });
  const nameBox = await page.$('div[contenteditable="true"][data-tab="10"]');
  await nameBox.type("Kuhenraj", { delay: 100 });
  await nameBox.press('Enter');
  console.log("> Name sent successfully!");

  } catch (e) {
    console.error("> Button click failed: ", e);
  }
    
    // Backup method - try clicking by text
    /*try {
      console.log("🔄 Trying backup method...");
      await page.getByText('Proceed').click();
      console.log("🎉 Clicked using backup method!");
    } catch (e2) {
      console.error("Backup method also failed: ", e2);
    }
  }
  console.log("🔄 Done. Browser stays open.");*/

  try {
    console.log("> Looking for error message...");
    
   // Wait with countdown before typing error
  await new Promise(resolve => setTimeout(resolve, 10000)); // wait 5 seconds

  // Wait for message box
  await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 30000 });
  const nameBox = await page.$('div[contenteditable="true"][data-tab="10"]');
  await nameBox.type("123", { delay: 100 });
  await nameBox.press('Enter');
  console.log("> Error 1 sent successfully!");


  await new Promise(resolve => setTimeout(resolve, 8000)); // wait 5 seconds

  // Wait for message box
  await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 30000 });
  const nameBox1 = await page.$('div[contenteditable="true"][data-tab="10"]');
  await nameBox1.type("Hello", { delay: 100 });
  await nameBox1.press('Enter');
  console.log("> Error 2 sent successfully!");


  await new Promise(resolve => setTimeout(resolve, 8000)); // wait 5 seconds

  // Wait for message box
  await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 30000 });
  const nameBox2 = await page.$('div[contenteditable="true"][data-tab="10"]');
  await nameBox2.type("✅✅✅", { delay: 100 });
  await nameBox2.press('Enter');
  console.log("> Error 3 sent successfully!");


  } catch (e) {
    console.error("> Button click failed: ", e);
  }

//**CONTINUE THE RECEIPT CODE HERE - DONT TOUCH OTHER CODES!**

  // Receipt upload flow
 /* console.log("> Waiting for receipt upload...");
  
  // Wait for user to manually upload receipt (you can adjust this time)
  await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30 seconds for user to upload
  
  console.log("> Waiting for validation message...");
  
  // Wait a bit more for the validation message to appear
  await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds
  
  // Look for "Chat with agent" button
  try {
    console.log("> Looking for Chat with agent button...");
    
    // Wait for the button to appear (adjust timeout as needed)
    await page.waitForTimeout(5000);
    
    // Try multiple selectors for the "Chat with agent" button
    const chatButtonSelectors = [
      'div._ahef[role="button"]:has-text("Chat with Agent")',
      '[role="button"]:has-text("Chat with Agent")',
      'div[role="button"]:has-text("Chat with Agent")',
      'button:has-text("Chat with Agent")',
      'div._ahef[role="button"]' // fallback to same class as Proceed button
    ];
    
    let buttonClicked = false;
    
    for (const selector of chatButtonSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await element.textContent();
          if (text && (text.includes('Chat with Agent') || text.includes('chat with agent'))) {
            console.log(`> Found Chat with agent button with selector: ${selector}`);
            await element.click();
            console.log("> Chat with agent button clicked!");
            buttonClicked = true;
            break;
          }
        }
      } catch (error) {
        continue; // Try next selector
      }
    }
    
    if (!buttonClicked) {
      console.log("> Could not find Chat with agent button, trying generic approach...");
      // Try to find all buttons and click the one with "agent" text
      const allButtons = await page.$$('[role="button"]');
      for (const button of allButtons) {
        const text = await button.textContent();
        if (text && text.toLowerCase().includes('Agent')) {
          await button.click();
          console.log("> Clicked button containing 'agent'");
          buttonClicked = true;
          break;
        }
      }
    }
    
    if (!buttonClicked) {
      console.log("> Chat with agent button not found or clicked");
    }
    
  } catch (e) {
    console.error("> Error clicking Chat with agent button: ", e);
  }
*/

// Receipt upload flow - OPTIMIZED
  console.log("> Waiting for receipt upload...");
  
  // Wait for user to manually upload receipt (reduced time)
  await new Promise(resolve => setTimeout(resolve, 15000)); // wait 15 seconds for user to upload
  
  //------------------------------------------------------------------------------------------------------------------
  //auto receipt
  //-------------------------------------------------------------------------------------------------------------------


  console.log("> Looking for Chat with Agent button...");
  
  // Use only the working selector - much faster!
  try {
    // Wait for the exact button that works
    await page.waitForSelector('div._ahef[role="button"]:has-text("Chat with Agent")', { timeout: 20000 });
    
    // Click it directly
    await page.click('div._ahef[role="button"]:has-text("Chat with Agent")');
    console.log("> Chat with Agent button clicked!");
    
  } catch (e) {
    console.error("> Error clicking Chat with Agent button: ", e);
  }

  await new Promise(resolve => setTimeout(resolve, 8000)); // wait 5 seconds

  // Wait for message box
  await page.waitForSelector('div[contenteditable="true"][data-tab="10"]', { timeout: 30000 });
  const agentBox = await page.$('div[contenteditable="true"][data-tab="10"]');
  await agentBox.type("Hi, how to do this....", { delay: 100 });
  await agentBox.press('Enter');
  console.log("> Agent enquiry sent successfully!");

})();

