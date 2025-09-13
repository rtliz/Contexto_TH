"use client";
import React, { useState } from "react";
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  // เป้าหมาย: คำภาษาไทย (ควรดึงจาก Supabase ในอนาคต)
  const targetWord = "แมว";

  // ฟังก์ชันวัดความเชื่อมโยง (คะแนน 1 คือถูกต้อง)
  function getSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1;
    // ตัวอย่าง: คะแนนสุ่ม (ควรใช้โมเดลภาษาไทยจริง)
    return Math.floor(Math.random() * 1000) + 2;
  }

  const handleGuess = async () => {
    const similarity = getSimilarity(guess, targetWord);
    setResult(`คะแนนความเหมือน: ${similarity}`);
    setHistory([...history, `${guess} (${similarity})`]);
    setGuess(""); 
    if(similarity == 1){
      setSuccessPopup(true);
      await supabase.from('scores').insert({ wordId: guess, similarity });
    }
  };

  return (
    <main className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-2">Contexto Thai</h1>
      <p className="text-center text-gray-600 mb-6">
        ทายคำภาษาไทยให้เหมือนกับคำเป้าหมาย 
      </p>
      <div className="text-center text-sm text-gray-500 mb-2">
        พิมพ์คำที่คุณคิดว่าใกล้เคียงที่สุด
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGuess();
            }
          }}
          placeholder="พิมพ์คำที่ต้องการทาย เช่น แมว, สุนัข, ..."
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
         
      </div>
      {result && (
        <div
          className={`mt-4 text-center text-lg font-bold ${
            result.includes("1") ? "text-green-600" : "text-blue-600"
          }`}
        >
          {result}
        </div>
      )}

      {successPopup && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-2">ยินดีด้วย!</h2>
            <p className="text-gray-600">คุณทายคำถูกต้องแล้ว กรุณาใส่ชื่อ</p>
            <input
              type="text"
              value={guess}
              className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
            />
            <button
              className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
              onClick={() => setSuccessPopup(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
      <h3 className="mt-8 mb-2 text-xl font-semibold">ประวัติการทาย</h3>
      <ul className="space-y-1">
        {history
          .sort((a, b) => {
            const scoreA = parseInt(a.split("(")[1]);
            const scoreB = parseInt(b.split("(")[1]);
            return scoreA - scoreB;
          })
          .map((item, idx) => {
            const score = parseInt(item.split("(")[1]);
            let color = "bg-gray-100 text-gray-700";
            if (score === 1) color = "bg-green-100 text-green-700 font-bold";
            else if (score <= 20) color = "bg-orange-100 text-orange-700";
            else if (score <= 60) color = "bg-red-100 text-red-700";
            else color = "bg-gray-200 text-gray-500";
            return (
              <li
                key={idx}
                className={`rounded px-2 py-1 ${color}`}
              >
                {item}
              </li>
            );
          })}
      </ul>
    </main>
  );
}
