import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, List, Flower } from 'lucide-react';
import './styles/MenuChapter.scss';
import { Modal, } from '@mui/material';

const MenuChapter = ({ currentChapter, chapters }) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    const handleLoadChapter = (chapterId) => {
        navigate(`/utebook-reader/${chapterId}`);
        window.location.reload();
    }
    return (
        <>
            <button
                className="control-button"
                onClick={() => setShowForm(true)}
            >
                <List />
            </button>

            <Modal open={showForm} onClose={() => setShowForm(false)}>
                <div className="chapter-list ">
                    {/* Header */}
                    <div className="chapter-list__header">
                        <h2 className="chapter-list__title">Danh sách</h2>
                        <button className="chapter-list__close-btn">
                            <X size={24} onClick={() => setShowForm(false)} />
                        </button>
                    </div>


                    {/* Chapter List - Scrollable */}
                    <div className="chapter-list__content">
                        {chapters.map(chapter => (
                            <div
                                key={chapter._id}
                                className={`chapter-list__item ${chapter._id === currentChapter ? 'chapter-list__item--active' : ''}`}
                                onClick={() => handleLoadChapter(chapter._id)}
                            >
                                <div className="chapter-list__item-title">
                                    {chapter.chapterName}
                                </div>
                                <div className={`chapter-list__item-status ${chapter.price === 0 ? 'free' : 'paid'}`}>
                                    <p>{chapter.price}</p> <Flower />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MenuChapter;