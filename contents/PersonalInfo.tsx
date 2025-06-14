// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/theme-toggle";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

// Icons
import { Mail01Icon, SmartPhone01Icon } from "hugeicons-react";

// React
import Link from "next/link";
import Image from "next/image";


const PersonalInfo = (props: {
    personalInfo: PersonalInfo
}) => {
    const { personalInfo } = props;
    return (
        <div className={`
            flex flex-row w-full 
            items-center justify-between mb-6`}>
            {/* Basic Info */}
            <div>
                <p className="font-bold text-[1.9rem]">{personalInfo.name}</p>
                <div className={`
                    flex min-md:flex-row max-sm:flex-col 
                    w-full gap-3 text-sm`}>
                    <Link
                        href={`mailto:${personalInfo.email.work[0]}`}
                        className="flex flex-row items-center gap-1">
                        <Mail01Icon size={20} />
                        <p>{personalInfo.email.work[0]}</p>
                    </Link>

                    <div className={`flex flex-row items-center gap-1`}>
                        <SmartPhone01Icon size={20} />
                        {personalInfo.phone.map((phone, id) => (
                            <Link 
                                href={`tel:${phone.area}${phone.number}`} 
                                key={id}>
                                <div className={`flex flex-row gap-1`}>
                                    <p>{`${phone.area} ${phone.number}`}</p>
                                    {id != personalInfo.phone.length - 1 && (
                                        <p className={`opacity-50`}>{`|`}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-4">
                {/** Theme Toggle */}
                <ModeToggle />

                {/*Avatar */}
                <HoverCard>
                    <HoverCardTrigger>
                        <Avatar className="hover:cursor-pointer">
                            <AvatarImage src={personalInfo.avatar_url} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex flex-row items-center justify-center">
                        <Image
                            src={personalInfo.avatar_url}
                            className="rounded-sm"
                            alt="avatar"
                            width={200}
                            height={200}
                        />
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    );
};

export default PersonalInfo;