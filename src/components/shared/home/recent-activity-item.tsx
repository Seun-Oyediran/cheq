'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avi } from '../avi';
import { SkeletonLoader } from '../skeleton-loader';
import { spring } from '@/lib/utils/static';

interface IProps {
  data: Array<{
    id: number;
    name: string;
    action: string;
  }>;
  duration?: number;
}

function RecentActivityItemLoading() {
  return (
    <div className="app_recent_activity_item flex justify-between items-center gap-4">
      <div className="app_recent_activity_item__left flex gap-2 items-center">
        <div className="">
          <SkeletonLoader height="40px" width="40px" borderRadius="50%" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonLoader width="80px" />
          <SkeletonLoader height="13px" width="123px" />
        </div>
      </div>
      <div className="app_recent_activity_item__right flex flex-col gap-1 items-end">
        <SkeletonLoader width="65px" />
        <SkeletonLoader height="13px" width="53px" />
      </div>
    </div>
  );
}

export function RecentActivityItem(props: IProps) {
  const { data, duration = 2 } = props;
  const [liveData, setLiveData] = useState(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prevData) => {
        const updatedData = [...prevData];
        const firstElement = updatedData.shift();
        if (firstElement) {
          firstElement.id = Date.now();
          updatedData.push(firstElement);
        }
        return updatedData;
      });
    }, duration * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {liveData?.map((item) => (
        <motion.div
          key={item?.id}
          layout
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 1, cursor: 'none' }}
          transition={spring}
          className="app_recent_activity_item flex justify-between items-center gap-4"
        >
          <div className="app_recent_activity_item__left flex gap-2 items-center">
            <div className="">
              <Avi variant="platinum" size={40} />
            </div>
            <div className="">
              <h4 className="app_recent_activity_item__left__name">{item?.name}</h4>
              <p className="app_recent_activity_item__left__address">0x9283...92839</p>
            </div>
          </div>
          <div className="app_recent_activity_item__right">
            <h4 className="app_recent_activity_item__left__name right">{item?.action}</h4>
            <p className="app_recent_activity_item__left__address right">30s Ago</p>
          </div>
        </motion.div>
      ))}

      <RecentActivityItemLoading />
    </AnimatePresence>
  );
}
