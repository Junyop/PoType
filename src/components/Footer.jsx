// ...existing code...
import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerStyle = {
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        padding: '12px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        background: 'linear-gradient(90deg, rgba(63,81,181,0.95), rgba(124,0,0,0.95))',
        color: '#fff',
        boxShadow: '0 -4px 18px rgba(0,0,0,0.25)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'saturate(120%) blur(4px)',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
        overflow: 'hidden',
    };

    const leftStyle = {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        minWidth: 0,
        flex: '1 1 0',
    };

    const centerStyle = {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'nowrap',
        minWidth: 0,
        flex: '0 0 auto',
        justifyContent: 'center',
        margin: '0 auto',
        overflow: 'hidden',
    };

    const centerTextStyle = {
        fontSize: 13,
        opacity: 0.9,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'center',
    };

    const rightStyle = {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        minWidth: 0,
        flex: '1 1 0',
        justifyContent: 'flex-end',
    };

    const iconBtn = {
        flexShrink: 0,
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.06)',
        color: '#fff',
        transition: 'transform .15s ease, background .15s ease',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.04)',
    };

    return (
        <footer style={footerStyle}>
            <div style={leftStyle}>
                <div style={{ fontWeight: 700, fontSize: 16, minWidth: 0 }}>PoType</div>
                <div style={{ opacity: 0.9, fontSize: 14, minWidth: 0 }}>Pokémon Tip / Takım Analizi</div>
            </div>

            <div style={centerStyle}>
                <div style={centerTextStyle}>© {currentYear} Junyop</div>
            </div>

            <div style={rightStyle}>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="Back to top"
                    style={{ ...iconBtn, padding: 6 }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    ▲
                </button>
            </div>
        </footer>
    );
};

export default Footer;
// ...existing code...