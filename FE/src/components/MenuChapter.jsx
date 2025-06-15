import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, List, Flower } from 'lucide-react';
import './styles/MenuChapter.scss';
import { Modal, } from '@mui/material';
import PurchaseChapterForm from './PurchaseChapterForm';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import CustomAlert from "./CustomAlert";

const MenuChapter = ({ currentChapter, chapters, bookName, bookType }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [listChapterOwned, setListChapterOwned] = useState([]);
    const [hoaPhuongAmount, setHoaPhuongAmount] = useState(0);
    const [readingId, setReadingId] = useState('');

    const handleLoadChapter = (chapterId) => {
        navigate(`/utebook-reader/${chapterId}`);
        window.location.reload();
    }
    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${user._id}`);
            if (response.data.success) {
                setListChapterOwned(response.data.data.listChapterOwned);
                const pointRes = await axios.get(`http://localhost:5000/api/points/${user._id}`);
                setHoaPhuongAmount(pointRes.data.data.quantity_HoaPhuong || 0);
            }
        }
        catch (err) {
            console.log(err);
        }
    };
    const getHistoryReading = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/history-readings/`,
                {
                    params: {
                        userId: user._id,
                        bookId: chapters[0].bookId,
                    },
                }
            );
            if (response.data.success) {
                setReadingId(response.data.data._id);
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await getUser();
                await getHistoryReading();
            } catch (err) {
                console.log(err);
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        fetchData();
    }, []);

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };
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
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 className="chapter-list__title">Danh sách</h2>
                            <div className='content-line'>
                                <p className='name'>Bạn hiện có: </p>
                                <div className='amount-hoaphuong'>
                                    <p>{hoaPhuongAmount.toLocaleString('vi')}</p> <Flower />
                                </div>
                            </div>


                        </div>
                        <button className="chapter-list__close-btn">
                            <X size={24} onClick={() => setShowForm(false)} />
                        </button>
                    </div>


                    {/* Chapter List - Scrollable */}
                    <div className="chapter-list__content">
                        {chapters.map(chapter => (
                            <PurchaseChapterForm
                                chapter={chapter}
                                currentChapter={currentChapter}
                                listChapterOwned={listChapterOwned}
                                setListChapterOwned={setListChapterOwned}
                                hoaPhuongAmount={hoaPhuongAmount}
                                bookName={bookName}
                                readingId={readingId}
                                handleLoadChapter={handleLoadChapter}
                                isLoadChapter={false}
                                setAlert={setAlert}
                                bookType={bookType}
                            />
                        ))}
                    </div>
                </div>
            </Modal>
            <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
        </>
    );
};

export default MenuChapter;