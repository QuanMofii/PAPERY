export function FileIcon({ file }) {
    return file.type === 'docx' ? (
        <svg
            width='25px'
            height='25px'
            viewBox='0 0 16 16'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            className='si-glyph si-glyph-document-doc'
            fill='#257bcb'
            stroke='#257bcb'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
                {' '}
                <title>171</title> <defs> </defs>{' '}
                <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    {' '}
                    <g transform='translate(2.000000, 0.000000)' fill='#257bcb'>
                        {' '}
                        <path d='M8.031,0.031 L8.031,3.969 L11.902,3.969 L8.031,0.031 Z' className='si-glyph-fill'>
                            {' '}
                        </path>{' '}
                        <rect x='2' y='9' width='0.965' height='1.989' className='si-glyph-fill'>
                            {' '}
                        </rect>{' '}
                        <rect x='6' y='9' width='0.953' height='1.953' className='si-glyph-fill'>
                            {' '}
                        </rect>{' '}
                        <path
                            d='M6.938,5.092 L6.938,0.069 L0.042,0.069 L0.042,15.938 L11.938,15.938 L11.938,5.092 L6.938,5.092 L6.938,5.092 Z M3.033,11.031 L3.033,12.04 L0.982,12.04 L0.982,7.973 L3.046,7.983 L3.046,8.954 L4.03,8.954 L4.046,11.032 L3.033,11.032 L3.033,11.031 Z M8.012,11.047 L7.016,11.047 L7.016,12.031 L5.969,12.031 L5.969,11.047 L4.975,11.047 L4.975,8.985 L5.969,8.985 L5.969,7.969 L7.016,7.969 L7.016,8.985 L8.012,8.985 L8.012,11.047 L8.012,11.047 Z M11.016,9.016 L10.016,9.016 L10.016,10.985 L11.016,10.985 L11.016,12 L9.954,12 L9.954,11.024 L8.97,11.024 L8.97,8.957 L9.954,8.957 L9.954,7.971 L11.016,7.971 L11.016,9.016 L11.016,9.016 Z'
                            className='si-glyph-fill'>
                            {' '}
                        </path>{' '}
                    </g>{' '}
                </g>{' '}
            </g>
        </svg>
    ) : (
        <svg
            width='25px'
            height='25px'
            viewBox='0 0 16 16'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            className='si-glyph si-glyph-document-pdf'
            fill='#a74444'
            stroke='#a74444'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
                {' '}
                <title>172</title> <defs> </defs>{' '}
                <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    {' '}
                    <g transform='translate(2.000000, 0.000000)' fill='#a74444'>
                        {' '}
                        <path
                            d='M6.964,0 L0.016,0 L0.016,15.958 L11.958,15.958 L11.958,5.033 L6.964,5.033 L6.964,0 L6.964,0 Z M4.047,10.036 L3.029,10.036 L3.029,11.021 L2.031,11.021 L2.031,12.046 L0.969,12.046 L0.969,7.954 L3.03,7.968 L3.03,8.952 L4.048,8.952 L4.048,10.036 L4.047,10.036 Z M8.953,7.953 L11.031,7.953 L11.031,9.031 L10.02,9.031 L10.02,9.953 L11.031,9.953 L11.031,11.014 L10.02,11.014 L10.02,12.032 L8.953,12.032 L8.953,7.953 L8.953,7.953 Z M7.033,7.971 L7.033,8.969 L8.006,8.969 L8.02,11 L7.016,11 L7.016,12.016 L4.969,12.016 L4.969,7.961 L7.033,7.971 L7.033,7.971 Z'
                            className='si-glyph-fill'>
                            {' '}
                        </path>{' '}
                        <path d='M8.025,0.021 L8.025,3.988 L11.979,3.988 L8.025,0.021 Z' className='si-glyph-fill'>
                            {' '}
                        </path>{' '}
                        <rect x='2' y='9' width='0.973' height='0.961' className='si-glyph-fill'>
                            {' '}
                        </rect>{' '}
                        <rect x='6' y='9' width='0.969' height='1.983' className='si-glyph-fill'>
                            {' '}
                        </rect>{' '}
                    </g>{' '}
                </g>{' '}
            </g>
        </svg>
    );
}
