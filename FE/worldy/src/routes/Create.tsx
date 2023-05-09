import * as React from 'react';
import { useState, useEffect } from 'react';
import LoaderPyramid from '../components/LoaderPyramid';
import { useParams } from 'react-router';
import CreateGame from '../components/create/CreateGame';
import Matching from '../components/create/Matching';
import Waiting from '../components/create/Waiting';

export default function Create() {
  const params = useParams();
  const gameId = params.id;
  const [mode, setMode] = useState<number>(0);

  const [loaded, setLoaded] = useState<boolean>(false);
  setTimeout(() => {
    setLoaded(true);
  }, 1000);
  return (
    <div className='w-screen h-screen bg-white'>
      {mode === 0 && <CreateGame setMode={setMode} />}
      {mode === 1 && <Matching />}
      {mode === 2 && <Waiting />}
    </div>
  );
}
