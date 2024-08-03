功能需求
  計時器：
    設置番茄鐘計時（25分鐘工作時間）。
    設置短暫休息（5分鐘）。
    設置長時間休息（15分鐘）。
    自動開始下一個計時週期。
  任務管理：
    添加、編輯和刪除任務。
    記錄完成的任務和所花費的番茄鐘數量。
  數據視覺化：
    顯示每天、每周、每月的番茄鐘數量。
    生成統計圖表來跟蹤工作進度。
  設置：
    調整工作和休息時間。
    配置通知和提醒。

技術選擇
  前端框架：React + Next.js
  狀態管理：React Context 或 Redux
  CSS 框架：Tailwind CSS
  UI 組件庫：Shadcn UI
  計時器功能：使用 setInterval 和 clearInterval
  圖表庫：Chart.js 或 Recharts
  數據存儲：本地存儲或 Firebase

網站結構和設計
  首頁：

    顯示當前任務和計時器。
    顯示計時週期進度條。
    開始/停止計時按鈕。
    當前週期狀態（工作、短暫休息、長時間休息）。
    當前完成的番茄鐘數量。
  任務頁面：

    任務列表（包括未完成和已完成的任務）。
    添加新任務的輸入框和按鈕。
    編輯和刪除任務按鈕。
  統計頁面：

    顯示每天、每周、每月的統計圖表。
    完成的番茄鐘數量圖表。
    任務完成情況統計。
  設置頁面：

    設置工作時間、短暫休息時間和長時間休息時間。
    配置通知和提醒（聲音、桌面通知等）。
    保存設置按鈕。