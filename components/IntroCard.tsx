"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";


const IntroCard = (props: {
    cardTitle: string,
    cardDescription: string,
    children: React.ReactNode | React.ReactNode[],
    hoverCardProps?: {
        description: string,
        date: string,
    }
}) => {
    const { cardTitle, cardDescription, children, hoverCardProps } = props;
    return (
        <Card>
            <CardHeader className={`h-full`}>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>
                    <span>
                        {cardDescription}
                        {hoverCardProps && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <div className={`inline-block ml-1`}>
                                        &#9432;
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex justify-between space-x-4">

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">{`@YanzhenHuang`}</h4>
                                            <p className="text-sm">
                                                {hoverCardProps.description}
                                            </p>
                                            <div className="flex items-center pt-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {`Written in ${hoverCardProps.date}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </span>
                </CardDescription>

            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default IntroCard;