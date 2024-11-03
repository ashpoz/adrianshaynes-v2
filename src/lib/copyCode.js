
/**
 * Module for adding copy functionality to code blocks
 * @module CodeCopyModule
 */

// Module variables
const COPY_BUTTON_CLASSES = 'copy-code-button'
const WRAPPER_CLASSES = 'code-block-wrapper'
const COPIED_FEEDBACK_DURATION = 1000

/**
 * Initialize copy buttons for all code blocks on the page
 * @param {string} buttonLabel - Initial text to display on copy buttons
 * @returns {void}
 */
export function initializeCodeCopyButtons(buttonLabel = 'Copy Code') {
	const codeBlocks = Array.from(document.querySelectorAll('pre'))
	attachCopyCodeButtonsToCodeBlocks(codeBlocks, buttonLabel)
}

/**
 * Attach copy buttons to a collection of code block elements
 * @param {HTMLElement[]} codeBlocks - Array of code block elements
 * @param {string} buttonLabel - Text to display on copy buttons
 * @private
 */
function attachCopyCodeButtonsToCodeBlocks(codeBlocks, buttonLabel) {
	for (let codeBlock of codeBlocks) {
		const wrapper = createCodeBlockWrapper()
		const copyButton = createCopyButton(buttonLabel)

		codeBlock.setAttribute('tabindex', '0')

		wrapCodeBlock(codeBlock, wrapper, copyButton)

		copyButton.addEventListener('click', async () => {
			await handleCopyCode(codeBlock, copyButton, buttonLabel)
		})
	}
}

/**
 * Create a wrapper element for a code block
 * @returns {HTMLElement}
 * @private
 */
function createCodeBlockWrapper() {
	const wrapper = document.createElement('div')
	wrapper.className = WRAPPER_CLASSES
	return wrapper
}

/**
 * Create a copy button element
 * @param {string} label - Button label text
 * @returns {HTMLElement}
 * @private
 */
function createCopyButton(label) {
	const button = document.createElement('button')
	button.className = COPY_BUTTON_CLASSES
	button.textContent = label
	return button
}

/**
 * Wrap a code block element in a wrapper with a copy button
 * @param {HTMLElement} codeBlock - The code block element
 * @param {HTMLElement} wrapper - The wrapper element
 * @param {HTMLElement} copyButton - The copy button element
 * @private
 */
function wrapCodeBlock(codeBlock, wrapper, copyButton) {
	codeBlock.appendChild(copyButton)
	codeBlock.parentNode.insertBefore(wrapper, codeBlock)
	wrapper.appendChild(codeBlock)
}

/**
 * Handle the code copy operation
 * @param {HTMLElement} codeBlock - The code block element
 * @param {HTMLElement} button - The copy button element
 * @param {string} originalLabel - Original button label to restore
 * @private
 */
async function handleCopyCode(codeBlock, button, originalLabel) {
	let codeElement = codeBlock.querySelector('code')

	if (!codeBlock) {
		console.error('No code element found in code block')
		return
	}

	try {
		await navigator.clipboard.writeText(codeElement.innerText)
		provideCopyFeedback(button, originalLabel)
	} catch(error) {
		console.error('Failed to copy code:', error)
		button.textContent = 'Copy failed'
	}
}

/**
 * Provide visual feedback after copying
 * @param {HTMLElement} button - The copy button element
 * @param {string} originalLabel - Original button label to restore
 * @private
 */
function provideCopyFeedback(button, originalLabel) {
	button.textContent = 'Code Copied'
	setTimeout(() => {
			button.textContent = originalLabel
	}, COPIED_FEEDBACK_DURATION)
}
