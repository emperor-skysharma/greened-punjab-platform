import { useEffect } from "react";

export default function WasteWarriorsGame() {
  useEffect(() => {
    // Game logic encapsulated to avoid global pollution
    class WasteWarriorsGame {
      score: number;
      lives: number;
      level: number;
      gameRunning: boolean;
      gamePaused: boolean;
      fallingItems: Array<{ element: HTMLElement; type: string; startTime: number }>;
      gameSpeed: number;
      fallDuration: number;
      spawnTimeout: any;
      wasteItems: Array<{ emoji: string; type: "recycling" | "composting" | "landfill"; name: string }>;

      constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.fallingItems = [];
        this.gameSpeed = 6000;
        this.fallDuration = 4000;
        this.spawnTimeout = null;

        this.wasteItems = [
          // Recycling
          { emoji: "🥤", type: "recycling", name: "Soda Can" },
          { emoji: "📰", type: "recycling", name: "Newspaper" },
          { emoji: "🍶", type: "recycling", name: "Glass Bottle" },
          { emoji: "📦", type: "recycling", name: "Cardboard Box" },
          { emoji: "🥛", type: "recycling", name: "Milk Carton" },

          // Composting
          { emoji: "🍌", type: "composting", name: "Banana Peel" },
          { emoji: "🍎", type: "composting", name: "Apple Core" },
          { emoji: "🥕", type: "composting", name: "Carrot Scraps" },
          { emoji: "🍃", type: "composting", name: "Leaves" },
          { emoji: "🥚", type: "composting", name: "Eggshells" },

          // Landfill
          { emoji: "🍟", type: "landfill", name: "Chip Bag" },
          { emoji: "🧻", type: "landfill", name: "Used Tissue" },
          { emoji: "💄", type: "landfill", name: "Makeup" },
          { emoji: "🔋", type: "landfill", name: "Battery" },
          { emoji: "🍭", type: "landfill", name: "Candy Wrapper" },
        ];

        this.initializeGame();
      }

      initializeGame() {
        this.updateDisplay();
        this.setupEventListeners();
      }

      setupEventListeners() {
        // Bin click handlers
        document.querySelectorAll<HTMLElement>(".ww-bin").forEach((bin) => {
          bin.addEventListener("click", () => {
            const binType = bin.dataset.type as "recycling" | "composting" | "landfill" | undefined;
            if (!binType) return;
            this.checkNearbyItems(binType, bin);
          });
        });

        // Start game button
        document.getElementById("ww-startGameBtn")?.addEventListener("click", () => {
          document.getElementById("ww-welcomeModal")?.classList.add("hidden");
          this.startGame();
        });

        // Play/Pause button
        document.getElementById("ww-playPauseBtn")?.addEventListener("click", () => {
          this.togglePause();
        });

        // Restart button
        document.getElementById("ww-restartBtn")?.addEventListener("click", () => {
          this.restartGame();
        });

        // Item click feedback (mobile/touch)
        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          if (target?.classList.contains("falling-item")) {
            const itemType = target.dataset.type!;
            this.showItemInfo(target, itemType);
          }
        });
      }

      startGame() {
        this.gameRunning = true;
        this.spawnItem();
      }

      spawnItem() {
        if (!this.gameRunning || this.gamePaused) return;

        const item = this.wasteItems[Math.floor(Math.random() * this.wasteItems.length)];
        const itemElement = this.createFallingItem(item);
        const area = document.getElementById("ww-gameArea");
        if (!area) return;
        area.appendChild(itemElement);
        this.fallingItems.push({
          element: itemElement,
          type: item.type,
          startTime: Date.now(),
        });

        // Remove item after it falls
        setTimeout(() => {
          if (itemElement.parentNode) {
            itemElement.remove();
            this.removeFromFallingItems(itemElement);
            if (!this.gamePaused) {
              this.loseLife();
            }
          }
        }, this.fallDuration);

        // Spawn next item
        const nextSpawnDelay = Math.max(2000, this.gameSpeed - this.level * 3000);
        this.spawnTimeout = setTimeout(() => this.spawnItem(), nextSpawnDelay);
      }

      createFallingItem(item: { emoji: string; type: string; name: string }) {
        const itemElement = document.createElement("div");
        itemElement.className =
          "falling-item bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-2xl border-2 border-white hover:shadow-3xl transform hover:scale-110 transition-all duration-200";
        itemElement.innerHTML = `
          <div class="text-4xl mb-2 animate-pulse">${item.emoji}</div>
          <div class="text-xs font-bold text-center text-gray-700 bg-white bg-opacity-80 rounded-lg px-2 py-1">${item.name}</div>
        `;
        itemElement.dataset.type = item.type;
        itemElement.style.left = Math.random() * (window.innerWidth - 100) + "px";
        itemElement.style.animationDuration = this.fallDuration + "ms";
        itemElement.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.2))";
        itemElement.style.animationName = "fall";
        itemElement.style.animationTimingFunction = "linear";
        itemElement.style.position = "absolute";
        itemElement.style.top = "0px";
        itemElement.style.zIndex = "10";
        itemElement.style.cursor = "pointer";
        return itemElement;
      }

      togglePause() {
        if (!this.gameRunning) return;

        this.gamePaused = !this.gamePaused;

        const playPauseIcon = document.getElementById("ww-playPauseIcon");
        const playPauseText = document.getElementById("ww-playPauseText");

        if (this.gamePaused) {
          this.fallingItems.forEach((fi) => {
            fi.element.style.animationPlayState = "paused";
          });
          if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
          if (playPauseIcon) playPauseIcon.textContent = "▶️";
          if (playPauseText) playPauseText.textContent = "Play";
        } else {
          this.fallingItems.forEach((fi) => {
            fi.element.style.animationPlayState = "running";
          });
          this.spawnItem();
          if (playPauseIcon) playPauseIcon.textContent = "⏸️";
          if (playPauseText) playPauseText.textContent = "Pause";
        }
      }

      checkNearbyItems(binType: "recycling" | "composting" | "landfill", binElement: HTMLElement) {
        if (this.gamePaused) return;

        let itemSorted = false;

        this.fallingItems.forEach((fallingItem, index) => {
          const itemRect = fallingItem.element.getBoundingClientRect();
          const binRect = binElement.getBoundingClientRect();

          // Near bottom range to sort
          if (itemRect.bottom > window.innerHeight - 500) {
            if (fallingItem.type === binType) {
              this.correctSort(fallingItem.element, binElement);
              itemSorted = true;
            } else {
              this.wrongSort(fallingItem.element, binElement);
            }
            fallingItem.element.remove();
            this.fallingItems.splice(index, 1);
          }
        });

        if (!itemSorted && this.fallingItems.length > 0) {
          this.showMessage("No items in range!", binElement);
        }
      }

      correctSort(_: HTMLElement, binElement: HTMLElement) {
        this.score += 10;
        binElement.classList.add("bin-correct");
        setTimeout(() => binElement.classList.remove("bin-correct"), 600);
        this.showMessage("+10 points!", binElement, "text-green-600");
        this.updateDisplay();
        this.checkLevelUp();
      }

      wrongSort(_: HTMLElement, binElement: HTMLElement) {
        this.score = Math.max(0, this.score - 5);
        binElement.classList.add("bin-wrong");
        setTimeout(() => binElement.classList.remove("bin-wrong"), 500);
        this.showMessage("Wrong bin! -5 points", binElement, "text-red-600");
        this.updateDisplay();
      }

      showMessage(text: string, element: HTMLElement, className = "text-blue-600") {
        const message = document.createElement("div");
        message.className = `absolute text-lg font-bold ${className} pointer-events-none z-20`;
        message.textContent = text;
        message.style.left = "50%";
        message.style.transform = "translateX(-50%)";
        message.style.bottom = "120px";
        element.appendChild(message);
        setTimeout(() => message.parentNode && message.remove(), 1500);
      }

      loseLife() {
        this.lives--;
        this.updateDisplay();
        if (this.lives <= 0) {
          this.gameOver();
        }
      }

      checkLevelUp() {
        const newLevel = Math.floor(this.score / 200) + 1;
        if (newLevel > this.level) {
          this.level = newLevel;
          this.updateDisplay();
          this.showLevelUpMessage();
        }
      }

      showLevelUpMessage() {
        const message = document.createElement("div");
        message.className =
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-3xl font-bold p-8 rounded-2xl shadow-2xl z-30 border-4 border-yellow-300 animate-bounce";
        message.innerHTML = `
          <div class="text-4xl mb-2">🎉</div>
          <div>Level ${this.level}!</div>
          <div class="text-lg font-normal mt-2">Keep sorting!</div>
        `;
        document.body.appendChild(message);
        setTimeout(() => message.parentNode && message.remove(), 3000);
      }

      updateDisplay() {
        const scoreEl = document.getElementById("ww-score");
        const levelEl = document.getElementById("ww-level");
        const livesEl = document.getElementById("ww-lives");
        if (scoreEl) scoreEl.textContent = String(this.score);
        if (levelEl) levelEl.textContent = String(this.level);
        if (livesEl) {
          const hearts = "❤️".repeat(this.lives) + "🖤".repeat(Math.max(0, 3 - this.lives));
          livesEl.textContent = hearts;
        }
      }

      removeFromFallingItems(element: HTMLElement) {
        this.fallingItems = this.fallingItems.filter((i) => i.element !== element);
      }

      gameOver() {
        this.gameRunning = false;
        this.fallingItems.forEach((i) => i.element.parentNode && i.element.remove());
        this.fallingItems = [];

        const scoreEl = document.getElementById("ww-finalScore");
        const levelEl = document.getElementById("ww-finalLevel");
        if (scoreEl) scoreEl.textContent = String(this.score);
        if (levelEl) levelEl.textContent = String(this.level);

        let rating = "";
        if (this.score >= 800) rating = "🌟 Waste Segregation Master";
        else if (this.score >= 400) rating = "👍 Great Job! 👍<br> You're a Waste Warrior";
        else if (this.score >= 200) rating = "😊 Good Effort! 😊<br> Keep Practicing";
        else rating = "💡 Try Again! 💡<br> Learn and improve";
        const ratingEl = document.getElementById("ww-finalRating");
        if (ratingEl) ratingEl.innerHTML = rating;

        document.getElementById("ww-gameOverModal")?.classList.remove("hidden");
      }

      restartGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 5000;
        this.gamePaused = false;
        this.fallingItems = [];
        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        const icon = document.getElementById("ww-playPauseIcon");
        const text = document.getElementById("ww-playPauseText");
        if (icon) icon.textContent = "⏸️";
        if (text) text.textContent = "Pause";
        const area = document.getElementById("ww-gameArea");
        if (area) area.innerHTML = "";
        document.getElementById("ww-gameOverModal")?.classList.add("hidden");
        this.updateDisplay();
        this.startGame();
      }

      showItemInfo(item: HTMLElement, itemType: string) {
        const binNames: Record<string, string> = {
          recycling: "Recycling Bin ♻️",
          composting: "Composting Bin 🌱",
          landfill: "Landfill Bin 🗑️",
        };
        const name = binNames[itemType] || "Unknown";
        this.showMessage(`Goes in: ${name}`, item, "text-purple-600");
      }
    }

    const game = new WasteWarriorsGame();
    return () => {
      // No-op cleanup; events are on elements that unmount with component
      // If needed, we could remove document-level listeners here.
    };
  }, []);

  return (
    <div className="game-container relative min-h-[80vh] sm:min-h-[90vh] overflow-hidden rounded-3xl">
      <style>
        {`
        @keyframes fall {
          from { transform: translateY(-100px); }
          to { transform: translateY(600px); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .falling-item { animation: fall linear; }
        .bin-correct { animation: bounce 0.6s ease-in-out; }
        .bin-wrong { animation: shake 0.5s ease-in-out; }
      `}
      </style>

      {/* Decorative gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(135deg, #2d5016 0%, #4a7c59 30%, #6b8e23 60%, #8fbc8f 100%)"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(46, 125, 50, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(102, 187, 106, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 195, 74, 0.2) 0%, transparent 50%)
        `
      }} />

      {/* Header */}
      <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-lg border-b border-white/20">
        <h1 className="text-2xl sm:text-4xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
          <span className="text-3xl sm:text-5xl animate-pulse">♻️</span>
          <span className="bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">Waste Warriors</span>
        </h1>
        <div className="mt-4 sm:mt-0 flex gap-4 sm:gap-8 text-white items-center">
          <button id="ww-playPauseBtn" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
            <span id="ww-playPauseIcon">⏸️</span>
            <span id="ww-playPauseText">Pause</span>
          </button>
          <div className="text-center bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div id="ww-score" className="text-2xl sm:text-3xl font-bold text-yellow-300 drop-shadow-md">0</div>
            <div className="text-xs sm:text-sm font-semibold">Score</div>
          </div>
          <div className="text-center bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div id="ww-lives" className="text-2xl sm:text-3xl font-bold">❤️❤️❤️</div>
            <div className="text-xs sm:text-sm font-semibold">Lives</div>
          </div>
          <div className="text-center bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div id="ww-level" className="text-2xl sm:text-3xl font-bold text-green-300 drop-shadow-md">1</div>
            <div className="text-xs sm:text-sm font-semibold">Level</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div id="ww-gameArea" className="relative h-[70vh] sm:h-[80vh] w-full z-0" />

      {/* Bins */}
      <div className="relative z-10 bg-gradient-to-t from-white via-white to-transparent p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 max-w-5xl mx-auto">
          <div id="ww-recycling-bin" className="ww-bin flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl cursor-pointer hover:from-blue-500 hover:to-blue-700 transition-all duration-300 min-w-40 shadow-xl hover:shadow-2xl transform hover:scale-105 border-4 border-blue-300" data-type="recycling">
            <div className="text-4xl sm:text-6xl mb-3 animate-bounce">♻️</div>
            <div className="text-white font-bold text-base sm:text-lg text-center drop-shadow-md">RECYCLING</div>
            <div className="text-blue-100 text-xs sm:text-sm text-center mt-2 font-medium">Plastic • Glass • Metal • Paper</div>
          </div>

          <div id="ww-composting-bin" className="ww-bin flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl cursor-pointer hover:from-green-500 hover:to-green-700 transition-all duration-300 min-w-40 shadow-xl hover:shadow-2xl transform hover:scale-105 border-4 border-green-300" data-type="composting">
            <div className="text-4xl sm:text-6xl mb-3 animate-bounce">🌱</div>
            <div className="text-white font-bold text-base sm:text-lg text-center drop-shadow-md">COMPOSTING</div>
            <div className="text-green-100 text-xs sm:text-sm text-center mt-2 font-medium">Food scraps • Organic waste</div>
          </div>

          <div id="ww-landfill-bin" className="ww-bin flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl cursor-pointer hover:from-gray-600 hover:to-gray-800 transition-all duration-300 min-w-40 shadow-xl hover:shadow-2xl transform hover:scale-105 border-4 border-gray-400" data-type="landfill">
            <div className="text-4xl sm:text-6xl mb-3 animate-bounce">🗑️</div>
            <div className="text-white font-bold text-base sm:text-lg text-center drop-shadow-md">LANDFILL</div>
            <div className="text-gray-200 text-xs sm:text-sm text-center mt-2 font-medium">Non-recyclable items</div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <div id="ww-welcomeModal" className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-4 shadow-2xl border-4 border-green-200">
          <div className="text-4xl sm:text-6xl mb-4">🌍♻️🌱</div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome to Waste Warriors!
          </h2>

          <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 text-center">🎯 Game Rules</h3>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Watch items fall and click the correct bin when they're near the bottom</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <span>♻️ <strong>Recycling:</strong> Plastic bottles, glass, metal cans, paper</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <span>🌱 <strong>Composting:</strong> Food scraps, banana peels, organic waste</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <span>🗑️ <strong>Landfill:</strong> Non-recyclable items like chip bags, tissues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">5.</span>
                <span>Click on falling items to see which bin they belong in!</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3">🌟 Learning Outcome</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Master proper waste segregation to protect our environment! Learn which items can be recycled, composted, or need special disposal. Every correct sort helps reduce landfill waste and supports a sustainable future! 🌍💚
            </p>
          </div>

          <button
            id="ww-startGameBtn"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎮 Start Playing!
          </button>
        </div>
      </div>

      {/* Game Over Modal */}
      <div id="ww-gameOverModal" className="fixed inset-0 bg-black/60 flex items-center justify-center hidden z-50 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 sm:p-10 text-center max-w-lg mx-4 shadow-2xl border-4 border-white transform scale-95 hover:scale-100 transition-transform duration-300">
          <div className="text-4xl sm:text-5xl mb-4">🏅</div>
          <div className="text-xl sm:text-2xl font-bold mb-2">Your Waste Segregation Rating:</div>
          <h2 id="ww-finalRating" className="text-2xl sm:text-3xl font-bold mb-4"></h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 mb-6">
            <p className="text-lg sm:text-xl mb-3">
              Final Score: <span id="ww-finalScore" className="font-bold text-2xl sm:text-3xl text-green-600">0</span>
            </p>
            <p className="text-lg sm:text-xl mb-3">
              Level Reached: <span id="ww-finalLevel" className="font-bold text-2xl sm:text-3xl text-emerald-600">1</span>
            </p>
          </div>
          <button
            id="ww-restartBtn"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎮 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
