import React from 'react';
import { HiOutlineChat } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const tagColors = [
  '#C5D7EF', // 0
  '#F2E3C2', // 1
  '#C2E9E3', // 2
  '#F3D5D6', // 3
];

/**
 * CounselingList 컴포넌트
 * @param {Array} data - 상담 기록 배열 [{ id, text, tags }]
 * @param {number} selectedId - 현재 선택된 상담 ID
 */
function CounselingList({ data = [], selectedId = 1 }) {
  // 임시로 SelectedId 설정
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      {data.map(item => {
        const isSelected = item.id === selectedId;

        return (
          <button
            key={item.id}
            className="flex flex-col text-left rounded-lg p-3 transition cursor-pointer bg-white hover:bg-gray-100"
            onClick={() => navigate(`/c/${item.id}`)}
          >
            {/* 아이콘 + 텍스트 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <HiOutlineChat
                  size={22}
                  className={isSelected ? 'text-gray-900' : 'text-gray-400'}
                />
              </div>
              <span
                className={`truncate text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {item.text}
              </span>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full font-bold border"
                  style={{
                    backgroundColor: tagColors[idx % tagColors.length],
                    borderColor: tagColors[idx % tagColors.length],
                    color: isSelected ? '#222' : '#999',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CounselingList;