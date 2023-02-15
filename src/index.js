/**
 * Build styles
 */
 import './index.css';
 //import { IconUnderline } from '@codexteam/icons'

 /**
 * Underline Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
export default class Overline {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return 'reregaga-overline';
  };

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ api }) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'SPAN';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @returns {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    const termWrapper = this.api.selection.findParentTag(this.tag, Overline.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    const o = document.createElement(this.tag);

    o.classList.add(Overline.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    o.appendChild(range.extractContents());
    range.insertNode(o);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(o);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    const unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Overline.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   *
   * @returns {string}
   */
  get toolboxIcon() {
    //return IconUnderline;
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style="fill-rule:nonzero;fill:rgb(84.705882%,84.705882%,84.705882%);fill-opacity:1;stroke-width:20;stroke-linecap:round;stroke-linejoin:miter;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 72.382812 59.296875 L 166.367188 60.195312 " transform="matrix(0.1,0,0,0.1,0,0)"/><path style="fill:none;stroke-width:19;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 166.367188 142.1875 C 166.367188 115.742188 145.507812 94.335938 119.804688 94.335938 C 94.101562 94.335938 73.242188 115.742188 73.242188 142.1875 C 73.242188 168.632812 94.101562 190.078125 119.804688 190.078125 C 145.507812 190.078125 166.367188 168.632812 166.367188 142.1875 Z M 166.367188 142.1875 " transform="matrix(0.1,0,0,0.1,0,0)"/></g></svg>';
  }

  /**
   * Sanitizer rule
   *
   * @returns {{span: {class: string}}}
   */
  static get sanitize() {
    return {
      span: {
        class: Overline.CSS,
      },
    };
  }
}
