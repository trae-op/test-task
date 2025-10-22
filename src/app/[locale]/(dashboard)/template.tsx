// app/dashboard/template.tsx
import type { ReactNode } from 'react';

type TTemplateProps = {
	children: ReactNode;
};

// При зміні роуту (наприклад, з /dashboard/a на /dashboard/b)
// цей компонент буде повністю перемонтований.
const Template = (props: TTemplateProps) => {
	console.log('Template: Компонент оновлюється/перемонтовується!');

	return <div className='template'>{props.children}</div>;
};

export default Template;
