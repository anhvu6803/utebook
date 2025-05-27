import { useState } from 'react';
import { Book, Users, Star, Calendar, Link, Facebook } from 'lucide-react';
import './styles/AuthorProfilePage.scss';
import testAvatar from '../assets/testAvatar.jpg';
import Divider from '@mui/material/Divider';

const defaultAvatar = 'https://res.cloudinary.com/dbmynlh3f/image/upload/v1744354478/cciryt3jpun1dys5rz8s.png';

const AuthorProfile = () => {
    const [activeTab, setActiveTab] = useState('intro');

    return (
        <div className="author-profile">
            <nav className="navigation">
                <div className="nav-link">
                    <a href="/utebook">Trang chủ</a> &gt; {"Trang cá nhân"}
                </div>
            </nav>
            <div className="banner">

            </div>

            {/* Profile Section */}
            <div className="profile-container">
                <div className="profile-header">
                    {/* Avatar */}
                    <div className="avatar">
                        <img
                            src={testAvatar}
                            alt="Avatar"
                        />
                    </div>

                    {/* Author details */}
                    <div className="author-details">
                        <div className="author-header">
                            <div className="author-name-container">
                                <h1 className="author-name">Tứ Dạ</h1>
                                <p className="author-username">tuda.snv</p>
                            </div>
                            <div className="author-stats">
                                <div className="stat-item">
                                    <div className="stat-label">
                                        <Book size={16} />
                                        <span>Số truyện</span>
                                    </div>
                                    <span className="stat-value">3</span>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">
                                        <Users size={16} />
                                        <span>Người theo dõi</span>
                                    </div>
                                    <span className="stat-value">853</span>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">
                                        <Star size={16} />
                                        <span>Đề cử</span>
                                    </div>
                                    <span className="stat-value">162</span>
                                </div>
                                <button className="follow-button">
                                    <span>+ THEO DÕI</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />

                <div className="intro-container">
                    <div className='content-intro'>
                        <span className="title">Giới thiệu</span>
                        <p className="bio">Cô điều dưỡng có đam mê viết tiểu thuyết</p>

                        <Divider />

                        <div className="contact-info">
                            <div className="contact-item">
                                <Calendar size={16} />
                                <span>Ngày tham gia: 15/11/2022</span>
                            </div>
                            <div className="contact-item">
                                <Link size={16} />
                                <a href="#" className="link">https://www.tiktok.com/@tu_da_tear</a>
                            </div>
                            <div className="contact-item">
                                <Facebook size={16} />
                                <span>Facebook của Tứ Dạ</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'intro' && (
                        <></>
                    )}

                    {activeTab === 'stories' && (
                        <div className="stories-content">
                            <div className="story-card">
                                <div className="story-cover">
                                    <img
                                        src="/api/placeholder/100/150"
                                        alt="Book cover"
                                    />
                                </div>
                                <div className="story-details">
                                    <div className="story-header">
                                        <h3 className="story-title">Nắm tay ai giữa vạn người?</h3>
                                        <span className="story-status">Hoàn thành</span>
                                    </div>
                                    <p className="story-description">
                                        Trái đất vốn lạnh như vậy, nhưng người ta vẫn luồn qua nhau, đan vào và vỡ vụn như những con giỗ xù, chỉ mong mưới tìm một cuộc hành trình mới là. Chút hơi ấm còn vương lại đâu tay thật trống vắng kia cùng lúc đó, chút nhớt. Giữa hàng vạn người, nắm tay ai để thấy mình còn ấm áp.
                                    </p>
                                    <div className="story-stats">
                                        <div className="stat">
                                            <Book size={14} />
                                            <span>Chương: 1</span>
                                        </div>
                                        <div className="stat">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                            </svg>
                                            <span>Lượt đọc: 245</span>
                                        </div>
                                        <div className="stat">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                            </svg>
                                            <span>Theo dõi: 19</span>
                                        </div>
                                        <div className="stat">
                                            <Star size={14} />
                                            <span>Đã cứ: 3</span>
                                        </div>
                                    </div>
                                    <div className="story-type">Truyện ngắn</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;