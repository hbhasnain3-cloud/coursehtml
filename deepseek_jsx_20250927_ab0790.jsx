// frontend/components/CourseGrid.tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import CourseCard from './CourseCard';

interface CourseGridProps {
  endpoint: string;
  filters?: any;
}

export default function CourseGrid({ endpoint, filters }: CourseGridProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['courses', endpoint, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${endpoint}?page=${pageParam}&limit=20${filters ? `&${new URLSearchParams(filters)}` : ''}`
      );
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const courses = data?.pages.flatMap(page => page.courses) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course}
          ref={index === courses.length - 1 ? ref : undefined}
        />
      ))}
      
      {isFetchingNextPage && (
        Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))
      )}
    </div>
  );
}