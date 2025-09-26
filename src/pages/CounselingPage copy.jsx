// src/App.js
import React, { useState } from 'react';
import '../App.css';
import 'tailwindcss/tailwind.css';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import

function App() {
  const [formData, setFormData] = useState({
    location: '',
    date: '2025.09.02',
    time: '오후 10:10',
    details: '',
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // 다음 페이지로 이동하거나 API 호출 로직을 여기에 추가
  };
  
  const handleDateChange = (date) => {
      setFormData({ ...formData, date: date });
      setIsDatePickerOpen(false); // 선택 후 달력 닫기
  };
  
  const handleTimeChange = (time) => {
      setFormData({ ...formData, time: time });
      setIsTimePickerOpen(false); // 선택 후 시각 선택기 닫기
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Link to="/profile">
                    <span>청년동</span>
                </Link>
              <span role="img" aria-label="star" className="text-white">⭐</span>
            </div>
            <span className="text-3xl font-bold">poli.ai</span>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left py-3 px-4 rounded-lg bg-blue-100 text-blue-600 font-semibold flex items-center space-x-3">
              <span className="text-xl">+</span>
              <span>새 상담 시작</span>
            </button>
            <button className="w-full text-left py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
              <span>📚</span>
              <span>상담 목록</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span>청년동</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h1 className="text-xl font-bold">
                상담을 시작하기에 앞서, 사건에 대한 정보를 입력해 주세요. (1/2)
              </h1>
            </div>

            <div className="space-y-8">
              {/* 피해 장소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <b>피해 장소</b> | <span className="text-gray-500">어디서 피해를 겪으셨나요? 피해를 당하신 SNS, 혹은 사이트 명을 입력해 주세요.</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="SNS 혹은 사이트명"
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 피해 일시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <b>피해 일시</b> | <span className="text-gray-500">언제 피해를 겪으셨나요? 날짜와 시간을 선택해 주세요.</span>
                </label>
                <div className="mt-2 flex space-x-4">
                  {/* 날짜 선택기 */}
                  <div className="relative w-1/2">
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 cursor-pointer"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    />
                    <span 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                      🗓️
                    </span>
                    {isDatePickerOpen && (
                      <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="text-center font-bold mb-2">2025년 9월</div>
                        <div className="grid grid-cols-7 gap-1 text-sm text-center">
                          {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day} className="text-gray-500">{day}</div>)}
                          {[...Array(30).keys()].map(day => (
                            <div
                              key={day}
                              className={`p-1 rounded cursor-pointer ${day + 1 === 2 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                              onClick={() => handleDateChange(`2025.09.${(day + 1).toString().padStart(2, '0')}`)}
                            >
                              {day + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 시간 선택기 */}
                  <div className="relative w-1/2">
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-3 pr-10 cursor-pointer"
                      onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    />
                    <span 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
                      onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    >
                      ⏱️
                    </span>
                    {isTimePickerOpen && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4">
                        <div className="flex justify-around mb-4">
                          {/* 시 선택 */}
                          <div className="w-1/2 pr-2 overflow-y-scroll max-h-48 custom-scrollbar">
                            <p className="font-bold text-center border-b pb-1 mb-2">시</p>
                            {[...Array(24).keys()].map(hour => (
                              <div
                                key={hour}
                                className="p-2 text-center cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  const newTime = `${hour.toString().padStart(2, '0')}:${formData.time.split(':')[1]}`;
                                  setFormData({ ...formData, time: newTime });
                                }}
                              >
                                {hour.toString().padStart(2, '0')}
                              </div>
                            ))}
                          </div>
                          {/* 분 선택 */}
                          <div className="w-1/2 pl-2 overflow-y-scroll max-h-48 custom-scrollbar">
                            <p className="font-bold text-center border-b pb-1 mb-2">분</p>
                            {[...Array(12).keys()].map(minuteIndex => (
                              <div
                                key={minuteIndex}
                                className="p-2 text-center cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  const newMinute = (minuteIndex * 5).toString().padStart(2, '0');
                                  const newTime = `${formData.time.split(':')[0]}:${newMinute}`;
                                  setFormData({ ...formData, time: newTime });
                                }}
                              >
                                {(minuteIndex * 5).toString().padStart(2, '0')}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 피해 상세 상황 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  피해 상세 상황 | <span className="text-gray-500">어떤 상황이고 어떤 부분이 고민인지 설명해 주세요.</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  예시. OO에게 계좌이체로 입금했는데, 약속한 물건을 아직 받지 못했어요. 돈을 돌려받을 수 있을까?
                </p>
                <div className="relative mt-2">
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="어떤 피해를 어떻게 경험했는지 편하게 입력해 주세요."
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-3 h-40 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {formData.details.length}/1000
                  </div>
                </div>
              </div>

              {/* 다음 버튼 */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="w-full max-w-md py-4 rounded-lg bg-gray-200 text-gray-500 font-bold text-lg cursor-not-allowed"
                  disabled
                >
                  다음
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            폴리의 역할은 정보를 제공하는데 있으며, 정식적 법률 상담 및 법률 상담은 아닙니다. 본 페이지는 법적 효력이 없습니다.
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;