import React, { useMemo, useRef, useState } from 'react'

import CountryMap from '../components/Explore/CountryMap';
import CountrySpeak from '../components/Explore/CountrySpeak';
import { CountryType } from '../components/Explore/WorldMap';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const countryLst: CountryType = {
  asia_Korea: "대한민국",
  asia_China: "중국",
  asia_India: "인도",
  asia_Japen: "일본",
  africa_Egypt: "이집트",
  europe_France: "프랑스",
  europe_Italia: "이탈리아",
  europe_Spain: "스페인",
  europe_UK: "영국",
  northAmerica_America: "미국",
}

const Country = () => {
  const params = useParams();
  const countryName:string = params.country || "";

  const [selectAsset, setSelectAsset] = useState<string>("");

  const GetSelectAssetName = ((name:string) => {
    setSelectAsset(name);
  });
  return (
    <div>
      {(selectAsset)
        ?
        <div className="absolute w-full h-full">
          <CountrySpeak GetSelectAssetName={GetSelectAssetName}/>
        </div>
        :
        null
      }
      <div className={`${(selectAsset) ? "blur-sm": ""}`}>
        <CountryMap countryName={countryName} GetSelectAssetName={GetSelectAssetName} selectAsset={selectAsset}/>
      </div>
    </div>
  )
}

export default Country;
