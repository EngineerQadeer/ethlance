'use client';

import { Button } from './ui/button';
import { jobCategories } from '@/lib/mock-data';

type JobFiltersProps = {
  onFilterChange: (category: string) => void;
  activeFilter: string;
};

export function JobFilters({ onFilterChange, activeFilter }: JobFiltersProps) {

  const handleFilterClick = (category: string) => {
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {jobCategories.map((category) => (
        <Button
          key={category}
          variant={activeFilter === category ? 'default' : 'secondary'}
          size="sm"
          onClick={() => handleFilterClick(category)}
          className="transition-all"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
