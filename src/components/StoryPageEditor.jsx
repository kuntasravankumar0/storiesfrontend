import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiCopy, FiArrowUp, FiArrowDown, FiImage, FiType, FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from 'react-icons/fi';
import './StoryPageEditor.css';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];
const FONT_FAMILIES = ['Inter', 'Playfair Display', 'Georgia', 'Times New Roman', 'Arial', 'Verdana', 'Dancing Script'];
const COLORS = ['#000000', '#1a1a2e', '#333333', '#555555', '#7b2cbf', '#e94560', '#d4a853', '#10b981', '#3b82f6', '#ef4444'];

const StoryPageEditor = ({ pages, setPages }) => {

  const addPage = () => {
    setPages([...pages, { blocks: [{ type: 'text', content: '', styles: {} }] }]);
  };

  const deletePage = (pageIndex) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== pageIndex);
    setPages(newPages);
  };

  const duplicatePage = (pageIndex) => {
    const newPages = [...pages];
    const clone = JSON.parse(JSON.stringify(pages[pageIndex]));
    newPages.splice(pageIndex + 1, 0, clone);
    setPages(newPages);
  };

  const movePageUp = (pageIndex) => {
    if (pageIndex === 0) return;
    const newPages = [...pages];
    [newPages[pageIndex - 1], newPages[pageIndex]] = [newPages[pageIndex], newPages[pageIndex - 1]];
    setPages(newPages);
  };

  const movePageDown = (pageIndex) => {
    if (pageIndex === pages.length - 1) return;
    const newPages = [...pages];
    [newPages[pageIndex], newPages[pageIndex + 1]] = [newPages[pageIndex + 1], newPages[pageIndex]];
    setPages(newPages);
  };

  const addBlock = (pageIndex, type) => {
    const newPages = [...pages];
    const newBlock = type === 'text'
      ? { type: 'text', content: '', styles: { fontSize: '16px', fontFamily: 'Inter', color: '#000000', textAlign: 'left', bold: false, italic: false, underline: false } }
      : { type: 'image', url: '', width: '100%', height: 'auto', align: 'center' };
    newPages[pageIndex].blocks.push(newBlock);
    setPages(newPages);
  };

  const deleteBlock = (pageIndex, blockIndex) => {
    const newPages = [...pages];
    newPages[pageIndex].blocks.splice(blockIndex, 1);
    setPages(newPages);
  };

  const updateBlock = (pageIndex, blockIndex, updates) => {
    const newPages = [...pages];
    newPages[pageIndex].blocks[blockIndex] = { ...newPages[pageIndex].blocks[blockIndex], ...updates };
    setPages(newPages);
  };

  const updateBlockStyle = (pageIndex, blockIndex, styleUpdates) => {
    const newPages = [...pages];
    const block = newPages[pageIndex].blocks[blockIndex];
    block.styles = { ...block.styles, ...styleUpdates };
    setPages(newPages);
  };

  const moveBlockUp = (pageIndex, blockIndex) => {
    if (blockIndex === 0) return;
    const newPages = [...pages];
    const blocks = newPages[pageIndex].blocks;
    [blocks[blockIndex - 1], blocks[blockIndex]] = [blocks[blockIndex], blocks[blockIndex - 1]];
    setPages(newPages);
  };

  const moveBlockDown = (pageIndex, blockIndex) => {
    const newPages = [...pages];
    const blocks = newPages[pageIndex].blocks;
    if (blockIndex >= blocks.length - 1) return;
    [blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
    setPages(newPages);
  };

  return (
    <div className="story-editor">
      <div className="editor-header">
        <h3>📖 Story Page Editor</h3>
        <span className="page-count-badge">{pages.length} Page{pages.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="editor-pages">
        {pages.map((page, pageIndex) => (
          <motion.div
            key={pageIndex}
            className="editor-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Page Header */}
            <div className="page-header-bar">
              <span className="page-label">Page {pageIndex + 1}</span>
              <div className="page-actions-bar">
                <button type="button" onClick={() => movePageUp(pageIndex)} disabled={pageIndex === 0} title="Move Up"><FiArrowUp /></button>
                <button type="button" onClick={() => movePageDown(pageIndex)} disabled={pageIndex === pages.length - 1} title="Move Down"><FiArrowDown /></button>
                <button type="button" onClick={() => duplicatePage(pageIndex)} title="Duplicate"><FiCopy /></button>
                <button type="button" onClick={() => deletePage(pageIndex)} disabled={pages.length <= 1} title="Delete" className="delete-btn"><FiTrash2 /></button>
              </div>
            </div>

            {/* A4 Page Canvas */}
            <div className="a4-page">
              {page.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="content-block">
                  {/* Block Controls */}
                  <div className="block-controls">
                    <span className="block-type-label">{block.type === 'text' ? '📝 Text' : '🖼️ Image'}</span>
                    <div className="block-actions">
                      <button type="button" onClick={() => moveBlockUp(pageIndex, blockIndex)} disabled={blockIndex === 0}><FiArrowUp /></button>
                      <button type="button" onClick={() => moveBlockDown(pageIndex, blockIndex)} disabled={blockIndex === page.blocks.length - 1}><FiArrowDown /></button>
                      <button type="button" onClick={() => deleteBlock(pageIndex, blockIndex)} className="delete-btn"><FiTrash2 /></button>
                    </div>
                  </div>

                  {block.type === 'text' ? (
                    <div className="text-block-editor">
                      {/* Text Toolbar */}
                      <div className="text-toolbar">
                        <button type="button" className={`tb-btn ${block.styles?.bold ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { bold: !block.styles?.bold })}><FiBold /></button>
                        <button type="button" className={`tb-btn ${block.styles?.italic ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { italic: !block.styles?.italic })}><FiItalic /></button>
                        <button type="button" className={`tb-btn ${block.styles?.underline ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { underline: !block.styles?.underline })}><FiUnderline /></button>
                        <span className="tb-separator">|</span>
                        <button type="button" className={`tb-btn ${block.styles?.textAlign === 'left' ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { textAlign: 'left' })}><FiAlignLeft /></button>
                        <button type="button" className={`tb-btn ${block.styles?.textAlign === 'center' ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { textAlign: 'center' })}><FiAlignCenter /></button>
                        <button type="button" className={`tb-btn ${block.styles?.textAlign === 'right' ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { textAlign: 'right' })}><FiAlignRight /></button>
                        <button type="button" className={`tb-btn ${block.styles?.textAlign === 'justify' ? 'active' : ''}`} onClick={() => updateBlockStyle(pageIndex, blockIndex, { textAlign: 'justify' })}><FiAlignJustify /></button>
                        <span className="tb-separator">|</span>
                        <select className="tb-select" value={block.styles?.fontSize || '16px'} onChange={(e) => updateBlockStyle(pageIndex, blockIndex, { fontSize: e.target.value })}>
                          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select className="tb-select font-select" value={block.styles?.fontFamily || 'Inter'} onChange={(e) => updateBlockStyle(pageIndex, blockIndex, { fontFamily: e.target.value })}>
                          {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <input type="color" className="tb-color" value={block.styles?.color || '#000000'} onChange={(e) => updateBlockStyle(pageIndex, blockIndex, { color: e.target.value })} title="Text Color" />
                      </div>
                      {/* Text Area */}
                      <textarea
                        className="text-block-textarea"
                        value={block.content}
                        onChange={(e) => updateBlock(pageIndex, blockIndex, { content: e.target.value })}
                        placeholder="Enter your story text here..."
                        style={{
                          fontWeight: block.styles?.bold ? 'bold' : 'normal',
                          fontStyle: block.styles?.italic ? 'italic' : 'normal',
                          textDecoration: block.styles?.underline ? 'underline' : 'none',
                          textAlign: block.styles?.textAlign || 'left',
                          fontSize: block.styles?.fontSize || '16px',
                          fontFamily: block.styles?.fontFamily || 'Inter',
                          color: block.styles?.color || '#000000',
                        }}
                      />
                    </div>
                  ) : (
                    <div className="image-block-editor">
                      <div className="image-url-row">
                        <input
                          type="url"
                          value={block.url}
                          onChange={(e) => updateBlock(pageIndex, blockIndex, { url: e.target.value })}
                          placeholder="Paste image URL here..."
                        />
                      </div>
                      <div className="image-settings-row">
                        <div className="img-setting">
                          <label>Width</label>
                          <input type="text" value={block.width || '100%'} onChange={(e) => updateBlock(pageIndex, blockIndex, { width: e.target.value })} placeholder="e.g. 100%, 300px" />
                        </div>
                        <div className="img-setting">
                          <label>Height</label>
                          <input type="text" value={block.height || 'auto'} onChange={(e) => updateBlock(pageIndex, blockIndex, { height: e.target.value })} placeholder="e.g. auto, 400px" />
                        </div>
                        <div className="img-setting">
                          <label>Align</label>
                          <select value={block.align || 'center'} onChange={(e) => updateBlock(pageIndex, blockIndex, { align: e.target.value })}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                      {block.url && (
                        <div className="image-preview-box" style={{ textAlign: block.align || 'center' }}>
                          <img src={block.url} alt="Preview" style={{ width: block.width || '100%', height: block.height || 'auto', maxWidth: '100%' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Block Buttons */}
              <div className="add-block-row">
                <button type="button" className="add-block-btn" onClick={() => addBlock(pageIndex, 'text')}>
                  <FiType /> Add Text
                </button>
                <button type="button" className="add-block-btn" onClick={() => addBlock(pageIndex, 'image')}>
                  <FiImage /> Add Image
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Page Button */}
      <button type="button" className="add-page-btn" onClick={addPage}>
        <FiPlus /> Add New Page
      </button>
    </div>
  );
};

export default StoryPageEditor;
