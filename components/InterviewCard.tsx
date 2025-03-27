import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import DisplayTechIcons from "@/components/DisplayTechIcons";
import { Button } from "@/components/ui/button";
import { cn, getRandomInterviewCover, getTechLogos } from "@/lib/utils";

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const formatedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("D. MMMM YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div
          className={cn(
            "absolute top-0 right-0 px-4 py-2 rounded-bl-lg bg-light-600",
          )}
        >
          <p className="badge-text">{normalizedType}</p>
        </div>
        <Image
          src={getRandomInterviewCover()}
          alt={"cover image"}
          width={90}
          height={90}
          className="rounded-full object-fit"
        />
        <h3 className={"mt-5 capitalize"}>{role} Interview</h3>
        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2">
            <Image
              src={"/calendar.svg"}
              alt={"calendar"}
              width={22}
              height={22}
            />
            <p>{formatedDate}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image src={"/star.svg"} alt={"star"} width={22} height={22} />
            <p>{feedback?.totalScore || "____"}/100</p>
          </div>
        </div>
        <p className={"line-clamp-2 mt-5"}>
          {feedback?.finalAssessment ||
            "You haven’t taken the interview yet. Take it now to improve your skills."}
        </p>
      </div>
      <div className={"flex justify-around items-center mt-1"}>
        <DisplayTechIcons techStack={techstack} />

        <Button asChild className={"btn-primary"}>
          <Link
            href={feedback ? `/interview/${id}/feedback/` : `/interview/${id}`}
          >
            {feedback ? "Check feedback" : "View interview"}
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default InterviewCard;
