import React, { useState } from 'react';
import './styles/SettingsStyle.scss';
import { ALargeSmall } from 'lucide-react';
import { Modal } from '@mui/material';
import CustomSwitch from './CustomSwitch';

const SettingsStyle = ({
    setIsPageVertical,
    isPageVertical,
    changeScrollVertical,
    allLines,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    handleSeperateText,
    setBackgroundColor
}) => {
    const [selectedTheme, setSelectedTheme] = useState('white');
    const [selectedLayout, setSelectedLayout] = useState('wide');
    const [selectedFont, setSelectedFont] = useState('Netflix Sans');
    const [showForm, setShowForm] = useState(false);
    console.log(fontSize >= 26);

    const themes = [
        { id: 'black', color: '#000', name: 'Đen' },
        { id: 'white', color: '#ffffff', name: 'Trắng' },
        { id: 'gray', color: '#9ca3af', name: 'Xám' },
        { id: 'beige', color: '#d4b896', name: 'Be' }
    ];

    console.log(isPageVertical);

    const fonts = [
        'Netflix Sans',
        'Arial',
        'Verdana',
        'Tahoma',
        'Times New Roman',
        'Roboto'
    ];

    const handleChecked = (checked) => {
        setIsPageVertical(checked);
        console.log(isPageVertical);
        if (isPageVertical) {
            handleSeperateText(allLines, fontSize, fontFamily);
        } else {
            changeScrollVertical();
        }
    };

    return (
        <>
            <button
                className="control-button"
                onClick={() => setShowForm(true)}
            >
                <ALargeSmall size={30} />
            </button>

            <Modal open={showForm} onClose={() => setShowForm(false)}>
                <div className="settings-form">
                    <div className="setting-section">
                        <h3>Nền</h3>
                        <div className="theme-options">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
                                    style={{ backgroundColor: theme.color }}
                                    onClick={() => {setSelectedTheme(theme.id); setBackgroundColor(theme.color)}}
                                >
                                    {selectedTheme === theme.id && (
                                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <polyline points="20,6 9,17 4,12"></polyline>
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-section">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 264
                        }}
                        >
                            <h3>Cuộn dọc trang</h3>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={isPageVertical}
                                    onChange={(e) => {
                                        handleChecked(e.target.checked);
                                    }}

                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                    </div>

                    <div className="setting-section">
                        <h3>Cỡ và kiểu chữ</h3>
                        <div className="font-section">
                            <div className="font-list">
                                <div className="font-size-controls">
                                    <button
                                        className="font-size-btn"
                                        onClick={() => {
                                            const temp = fontSize - 2;
                                            if (temp >= 16) {
                                                setFontSize(temp);
                                                if (!isPageVertical) {
                                                    handleSeperateText(allLines, fontSize, fontFamily);
                                                }
                                            }
                                        }}
                                        disabled={fontSize <= 16}
                                    >
                                        A -
                                    </button>

                                    <button
                                        className="font-size-btn"
                                        onClick={() => {
                                            const temp = fontSize + 2;
                                            if (temp <= 26) {
                                                setFontSize(temp);
                                                if (!isPageVertical) {
                                                    handleSeperateText(allLines, fontSize, fontFamily);
                                                }
                                            }
                                        }}
                                        disabled={fontSize >= 26}
                                    >
                                        A +
                                    </button>
                                </div>
                                {fonts.map((font) => (
                                    <button
                                        key={font}
                                        className={`font-option ${selectedFont === font ? 'selected' : ''}`}
                                        onClick={() => { setSelectedFont(font); setFontFamily(font); }}
                                        style={{ fontFamily: font }}
                                    >
                                        {font}
                                        {selectedFont === font && (
                                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="20,6 9,17 4,12"></polyline>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SettingsStyle;