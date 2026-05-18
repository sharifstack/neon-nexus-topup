"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { Check, ChevronDown, Loader2, Search, X, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MediaRenderer from "@/components/MediaRenderer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GameSelectorProps {
  value: string | { _id: string; name: string; coverImage?: string; category?: string; [key: string]: any };
  onChange: (gameId: string, gameObj: any) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function GameSelector({
  value,
  onChange,
  label = "Select Game",
  required = false,
  className = "",
}: GameSelectorProps) {
  const { data: games, isLoading, error } = useSWR("/api/admin/inventory", fetcher);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine current selected game ID and Object
  const selectedId = typeof value === "object" && value !== null ? value._id : value;
  const selectedGame = games?.find((g: any) => g._id === selectedId) || (typeof value === "object" && value !== null ? value : null);

  // Filter games based on search query
  const filteredGames = games?.filter((game: any) => {
    const matchName = game.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = game.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchName || matchCat;
  }) || [];

  // Reset active index when search changes
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Open dropdown and focus search
  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Select game handler
  const handleSelect = (game: any) => {
    onChange(game._id, game);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredGames.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredGames[activeIndex]) {
        handleSelect(filteredGames[activeIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-white/50 uppercase mb-2 tracking-wider">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}

      {/* Main Selector Button */}
      <div
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="w-full bg-white/5 border border-white/10 hover:border-primary/50 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer outline-none focus:border-primary transition-all group shadow-inner"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedGame ? (
            <>
              {selectedGame.coverImage ? (
                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10 shadow flex-shrink-0">
                  <MediaRenderer
                    src={selectedGame.coverImage}
                    alt={selectedGame.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Gamepad2 className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-white truncate">{selectedGame.name}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider truncate">
                  {selectedGame.category} {selectedGame.type ? `• ${selectedGame.type}` : ""}
                </span>
              </div>
            </>
          ) : (
            <span className="text-sm text-white/40 italic">Select a game from inventory...</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedGame && !required && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("", null);
              }}
              className="p-1 text-white/40 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <ChevronDown className={`w-4 h-4 text-white/50 group-hover:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 bg-[#181824] border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-black/20">
              <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by game name or category..."
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Games List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-white/50 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs">Loading games inventory...</span>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-400 text-xs">Failed to load games inventory.</div>
              ) : filteredGames.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs italic">
                  No games found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredGames.map((game: any, index: number) => {
                  const isSelected = game._id === selectedId;
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={game._id}
                      onClick={() => handleSelect(game)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                        isActive ? "bg-primary/15 text-white" : "hover:bg-white/5 text-white/80"
                      } ${isSelected ? "bg-primary/10 font-bold border-l-4 border-primary" : ""}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {game.coverImage ? (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow flex-shrink-0">
                            <MediaRenderer
                              src={game.coverImage}
                              alt={game.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 flex-shrink-0">
                            <Gamepad2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-bold truncate text-white">{game.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                              {game.category}
                            </span>
                            {game.type && (
                              <span className="text-[10px] text-white/50 capitalize">
                                • {game.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer helper */}
            <div className="px-4 py-2 bg-black/20 border-t border-white/5 text-[10px] text-white/40 flex justify-between items-center">
              <span>Use ↑↓ arrows to navigate, Enter to select</span>
              <span>{filteredGames.length} games</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
