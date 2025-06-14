import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const IntroCard = (props:{
    cardTitle: string,
    cardDescription: string,
    children: React.ReactNode | React.ReactNode[]
}) => {
    const {cardTitle, cardDescription, children}= props;
    return(
        <Card>
            <CardHeader className={`h-full`}>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default IntroCard;