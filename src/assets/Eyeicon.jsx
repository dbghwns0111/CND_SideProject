import { useEffect, useState } from "react";

export default function EyeIcon() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // 커서 위치를 -1 ~ 1 범위로 정규화
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 눈동자 움직임의 세기
  const moveRange = 1.5;

  const leftEye = {
    cx: 18.44 + pos.x * moveRange,
    cy: 17.09 + pos.y * moveRange,
  };
  const rightEye = {
    cx: 25.89 + pos.x * moveRange,
    cy: 17.93 + pos.y * moveRange,
  };

  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#2ACC8B" />
      <path
        d="M18.206 6.14607L18.4907 5.08356L18.4907 5.08356L18.206 6.14607ZM28.481 8.90021L28.7657 7.83771L28.7657 7.83769L28.481 8.90021ZM33.8533 18.2054L34.9158 18.49L34.9158 18.49L33.8533 18.2054ZM31.1 28.4806L32.1625 28.7653L32.1625 28.7653L31.1 28.4806ZM21.7948 33.8529L21.5101 34.9155L21.5101 34.9155L21.7948 33.8529ZM11.5195 31.0998L11.2348 32.1623L11.2348 32.1623L11.5195 31.0998ZM6.1472 21.7946L5.08468 21.5099L5.08466 21.51L6.1472 21.7946ZM8.90048 11.5194L7.83796 11.2347L7.83795 11.2347L8.90048 11.5194ZM18.4214 31.9193L17.6473 32.7008L18.4214 31.9193ZM15.4069 31.1115L15.6865 32.1754L15.4069 31.1115ZM31.9198 21.5778L31.1383 20.8037L31.9198 21.5778ZM31.1121 24.5922L30.0482 24.8719L31.1121 24.5922ZM18.206 6.14607L17.9212 7.20858C19.0523 7.51166 20.0302 8.09387 20.8048 8.86084L21.5788 8.07921L22.3528 7.29758C21.3139 6.26888 20.0012 5.48832 18.4907 5.08356L18.206 6.14607ZM24.5929 8.88709L24.872 9.95107C25.9264 9.67442 27.0649 9.65958 28.1962 9.96272L28.481 8.90021L28.7657 7.83769C27.2553 7.433 25.728 7.45201 24.3137 7.82311L24.5929 8.88709Z"
        fill="white"
      />
      <rect
        x="22.4688"
        y="14.3999"
        width="5.35714"
        height="6.25"
        rx="2.67857"
        transform="rotate(6.47629 22.4688 14.3999)"
        fill="white"
      />
      <ellipse
        cx={rightEye.cx}
        cy={rightEye.cy}
        rx="1.11607"
        ry="1.78571"
        transform="rotate(6.47629 25.8919 17.9334)"
        fill="#2ACE8C"
      />
      <rect
        x="15.0156"
        y="13.5537"
        width="5.35714"
        height="6.25"
        rx="2.67857"
        transform="rotate(6.47629 15.0156 13.5537)"
        fill="white"
      />
      <ellipse
        cx={leftEye.cx}
        cy={leftEye.cy}
        rx="1.11607"
        ry="1.78571"
        transform="rotate(6.47629 18.4388 17.0872)"
        fill="#2ACE8C"
      />
    </svg>
  );
}
