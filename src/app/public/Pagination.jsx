"use client";

import { ArrowRight } from "@gravity-ui/icons";
// 1. Rename the HeroUI import to avoid a name clash with your function
import { Pagination as HeroUIPagination } from "@heroui/react";

export default function Pagination({ totalDoc, activePage, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalDoc / 9));

  const handlePageChange = (newPage) => {
    console.log("Navigated to page:", newPage);
    onPageChange(newPage);
  };

  return (
    <div className="dark bg-black p-4 rounded-lg flex text-center justify-center">
      {/* 2. Use the renamed component wrapper here */}
      <HeroUIPagination 
        className="justify-center"
        classNames={{
          cursor: "hidden", 
        }}
      >
        {/* 3. Reference HeroUIPagination's subcomponents explicitly */}
        <HeroUIPagination.Content>
          {/* Back Button */}
          <HeroUIPagination.Item>
            <HeroUIPagination.Previous 
              isDisabled={activePage === 1} 
              onPress={() => handlePageChange(activePage - 1)}
            >
              <HeroUIPagination.PreviousIcon>
                <ArrowRight className="rotate-180" />
              </HeroUIPagination.PreviousIcon>
              <span className="text-white/70 hover:text-white transition-colors">Back</span>
            </HeroUIPagination.Previous>
          </HeroUIPagination.Item>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isCurrentPage = activePage === p;

            return (
              <HeroUIPagination.Item key={p}>
                <HeroUIPagination.Link 
                  isActive={isCurrentPage} 
                  onPress={() => handlePageChange(p)}
                  className={`transition-all duration-200 bg-transparent rounded-none shadow-none font-medium
                    ${isCurrentPage 
                      ? "text-white border-b-2 border-white font-bold" 
                      : "text-white/60 hover:text-white border-b-2 border-transparent"
                    }`}
                >
                  {p}
                </HeroUIPagination.Link>
              </HeroUIPagination.Item>
            );
          })}

          {/* Next Button */}
          <HeroUIPagination.Item>
            <HeroUIPagination.Next 
              isDisabled={activePage === totalPages} 
              onPress={() => handlePageChange(activePage + 1)}
            >
              <span className="text-white/70 hover:text-white transition-colors">Next</span>
              <HeroUIPagination.NextIcon>
                <ArrowRight />
              </HeroUIPagination.NextIcon>
            </HeroUIPagination.Next>
          </HeroUIPagination.Item>
        </HeroUIPagination.Content>
      </HeroUIPagination>
    </div>
  );
}