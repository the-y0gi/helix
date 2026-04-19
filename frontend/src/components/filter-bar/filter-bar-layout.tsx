'use client'
import { FilterBarValues, Pages, SearchBoxValuesProps } from '@/constants/constants'
import { AnimatePresence, motion } from 'motion/react';
import React, { act, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { TabsNav } from '../ui/tabs-nav-aty';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { pages } from '@/constants/pages';


const FilterBarLayout = ({
  pages
}: {
  pages: Pages[]
}) => {
  const router = useRouter();
  const location = usePathname();
  const active = pages.find((page) => location.endsWith(page.link)) || pages[0]
  const ismobile = useIsMobile()
  return (
    <>
      {ismobile && <TabsNav mobile={false} tabs={pages} />}
      {
        active?.home_filter_box
      }
    </>
  );
}

export default FilterBarLayout