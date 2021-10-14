import React from 'react';
import Link from 'next/link'

interface Props {
    href: string;
    text: string;
}

function NextLink({href, text}:Props) {
    return (
        <Link href={href} >
            <a>{text}</a>
        </Link>
    );
}

export default NextLink;