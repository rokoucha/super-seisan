import { Button, Group, Input, NumberInput, Select, Stack } from '@mantine/core'
import React, { useCallback } from 'react'
import { spliceToNew } from '../utils'

export type CurrencyEditorProps = Readonly<{
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>
  currencies: Currency[]
}>

export type Currency = {
  symbol: string
  rate: number
}

const currencyData: { code: string; label: string }[] = [
  { code: 'AED', label: 'UAEディルハム' },
  { code: 'AFN', label: 'アフガニ' },
  { code: 'ALL', label: 'レク' },
  { code: 'AMD', label: 'ドラム' },
  { code: 'ANG', label: 'アンティル・ギルダー' },
  { code: 'AOA', label: 'クワンザ' },
  { code: 'ARS', label: 'アルゼンチン・ペソ' },
  { code: 'AUD', label: 'オーストラリア・ドル' },
  { code: 'AWG', label: 'アルバ・フロリン' },
  { code: 'AZN', label: 'アゼルバイジャン・マナト' },
  { code: 'BAM', label: '兌換マルク' },
  { code: 'BBD', label: 'バルバドス・ドル' },
  { code: 'BDT', label: 'タカ' },
  { code: 'BGN', label: 'レフ' },
  { code: 'BHD', label: 'バーレーン・ディナール' },
  { code: 'BIF', label: 'ブルンジ・フラン' },
  { code: 'BMD', label: 'バミューダ・ドル' },
  { code: 'BND', label: 'ブルネイ・ドル' },
  { code: 'BOB', label: 'ボリビアーノ' },
  { code: 'BOV', label: 'Mvdol（債券コード）' },
  { code: 'BRL', label: 'レアル' },
  { code: 'BSD', label: 'バハマ・ドル' },
  { code: 'BTN', label: 'ニュルタム' },
  { code: 'BWP', label: 'プラ' },
  { code: 'BYN', label: 'ベラルーシ・ルーブル' },
  { code: 'BZD', label: 'ベリーズ・ドル' },
  { code: 'CAD', label: 'カナダ・ドル' },
  { code: 'CDF', label: 'コンゴ・フラン' },
  { code: 'CHE', label: 'WIRユーロ（補完通貨）' },
  { code: 'CHF', label: 'スイス・フラン' },
  { code: 'CHW', label: 'WIRフラン（補完通貨）' },
  { code: 'CLF', label: 'ウニダ・デ・フォメント（債券コード）' },
  { code: 'CLP', label: 'チリ・ペソ' },
  { code: 'CNY', label: '人民元' },
  { code: 'COP', label: 'コロンビア・ペソ' },
  { code: 'COU', label: 'Unidad de Valor Real (UVR)（債券コード）' },
  { code: 'CRC', label: 'コスタリカ・コロン' },
  { code: 'CUC', label: '兌換ペソ' },
  { code: 'CUP', label: 'キューバ・ペソ' },
  { code: 'CVE', label: 'カーボベルデ・エスクード' },
  { code: 'CZK', label: 'チェコ・コルナ' },
  { code: 'DJF', label: 'ジブチ・フラン' },
  { code: 'DKK', label: 'デンマーク・クローネ' },
  { code: 'DOP', label: 'ドミニカ・ペソ' },
  { code: 'DZD', label: 'アルジェリア・ディナール' },
  { code: 'EGP', label: 'エジプト・ポンド' },
  { code: 'ERN', label: 'ナクファ' },
  { code: 'ETB', label: 'ブル' },
  { code: 'EUR', label: 'ユーロ' },
  { code: 'FJD', label: 'フィジー・ドル' },
  { code: 'FKP', label: 'フォークランド諸島ポンド' },
  { code: 'GBP', label: 'スターリング・ポンド' },
  { code: 'GEL', label: 'ラリ' },
  { code: 'GHS', label: 'セディ' },
  { code: 'GIP', label: 'ジブラルタル・ポンド' },
  { code: 'GMD', label: 'ダラシ' },
  { code: 'GNF', label: 'ギニア・フラン' },
  { code: 'GTQ', label: 'ケツァル' },
  { code: 'GYD', label: 'ガイアナ・ドル' },
  { code: 'HKD', label: '香港ドル' },
  { code: 'HNL', label: 'レンピラ' },
  { code: 'HRK', label: 'クーナ' },
  { code: 'HTG', label: 'グールド' },
  { code: 'HUF', label: 'フォリント' },
  { code: 'IDR', label: 'ルピア' },
  { code: 'ILS', label: '新シェケル' },
  { code: 'INR', label: 'インド・ルピー' },
  { code: 'IQD', label: 'イラク・ディナール' },
  { code: 'IRR', label: 'イラン・リヤル' },
  { code: 'ISK', label: 'アイスランド・クローナ' },
  { code: 'JMD', label: 'ジャマイカ・ドル' },
  { code: 'JOD', label: 'ヨルダン・ディナール' },
  { code: 'KES', label: 'ケニア・シリング' },
  { code: 'KGS', label: 'キルギス・ソム' },
  { code: 'KHR', label: 'リエル' },
  { code: 'KMF', label: 'コモロ・フラン' },
  { code: 'KPW', label: '朝鮮民主主義人民共和国ウォン' },
  { code: 'KRW', label: '大韓民国ウォン' },
  { code: 'KWD', label: 'クウェート・ディナール' },
  { code: 'KYD', label: 'ケイマン諸島・ドル' },
  { code: 'KZT', label: 'テンゲ' },
  { code: 'LAK', label: 'キープ' },
  { code: 'LBP', label: 'レバノン・ポンド' },
  { code: 'LKR', label: 'スリランカ・ルピー' },
  { code: 'LRD', label: 'リベリア・ドル' },
  { code: 'LSL', label: 'ロチ' },
  { code: 'LYD', label: 'リビア・ディナール' },
  { code: 'MAD', label: 'モロッコ・ディルハム' },
  { code: 'MDL', label: 'モルドバ・レウ' },
  { code: 'MGA', label: 'マダガスカル・アリアリ' },
  { code: 'MKD', label: 'マケドニア・デナール' },
  { code: 'MMK', label: 'チャット' },
  { code: 'MNT', label: 'トゥグルグ' },
  { code: 'MOP', label: 'マカオ・パタカ' },
  { code: 'MRU', label: 'ウギア' },
  { code: 'MUR', label: 'モーリシャス・ルピー' },
  { code: 'MVR', label: 'ルフィヤ' },
  { code: 'MWK', label: 'マラウイ・クワチャ' },
  { code: 'MXN', label: 'メキシコ・ペソ' },
  { code: 'MXV', label: 'メキシコ投資単位（債券コード）' },
  { code: 'MYR', label: 'リンギット' },
  { code: 'MZN', label: 'メティカル' },
  { code: 'NAD', label: 'ナミビア・ドル' },
  { code: 'NGN', label: 'ナイラ' },
  { code: 'NIO', label: 'ニカラグア・コルドバ' },
  { code: 'NOK', label: 'ノルウェー・クローネ' },
  { code: 'NPR', label: 'ネパール・ルピー' },
  { code: 'NZD', label: 'ニュージーランド・ドル' },
  { code: 'OMR', label: 'オマーン・リアル' },
  { code: 'PAB', label: 'バルボア' },
  { code: 'PEN', label: 'ヌエボ・ソル' },
  { code: 'PGK', label: 'キナ' },
  { code: 'PHP', label: 'フィリピン・ペソ' },
  { code: 'PKR', label: 'パキスタン・ルピー' },
  { code: 'PLN', label: 'ズウォティ' },
  { code: 'PYG', label: 'グアラニー' },
  { code: 'QAR', label: 'カタール・リヤル' },
  { code: 'RON', label: 'ルーマニア・レウ' },
  { code: 'RSD', label: 'セルビア・ディナール' },
  { code: 'RUB', label: 'ロシア・ルーブル' },
  { code: 'RWF', label: 'ルワンダ・フラン' },
  { code: 'SAR', label: 'サウジアラビア・リヤル' },
  { code: 'SBD', label: 'ソロモン諸島ドル' },
  { code: 'SCR', label: 'セーシェル・ルピー' },
  { code: 'SDG', label: 'スーダン・ポンド' },
  { code: 'SEK', label: 'スウェーデン・クローナ' },
  { code: 'SGD', label: 'シンガポール・ドル' },
  { code: 'SHP', label: 'セントヘレナ・ポンド' },
  { code: 'SLL', label: 'レオン' },
  { code: 'SOS', label: 'ソマリア・シリング' },
  { code: 'SRD', label: 'スリナム・ドル' },
  { code: 'SSP', label: '南スーダン・ポンド' },
  { code: 'STN', label: 'ドブラ' },
  { code: 'SVC', label: 'サルバドール・コロン' },
  { code: 'SYP', label: 'シリア・ポンド' },
  { code: 'SZL', label: 'リランゲニ' },
  { code: 'THB', label: 'バーツ' },
  { code: 'TJS', label: 'ソモニ' },
  { code: 'TMT', label: 'トルクメニスタン・マナト' },
  { code: 'TND', label: 'チュニジア・ディナール' },
  { code: 'TOP', label: 'パアンガ' },
  { code: 'TRY', label: 'トルコリラ' },
  { code: 'TTD', label: 'トリニダード・トバゴ・ドル' },
  { code: 'TWD', label: 'ニュー台湾ドル' },
  { code: 'TZS', label: 'タンザニア・シリング' },
  { code: 'UAH', label: 'フリヴニャ' },
  { code: 'UGX', label: 'ウガンダ・シリング' },
  { code: 'USD', label: 'アメリカ合衆国ドル' },
  { code: 'USN', label: 'アメリカ合衆国ドル（翌日）（債券コード）' },
  {
    code: 'UYI',
    label: 'Uruguay Peso en Unidades Indexadas (URUIURUI)（債券コード）',
  },
  { code: 'UYU', label: 'ウルグアイ・ペソ' },
  { code: 'UYW', label: 'Unidad previsional' },
  { code: 'UZS', label: 'スム' },
  { code: 'VES', label: 'ボリバル・ソベラノ' },
  { code: 'VND', label: 'ドン' },
  { code: 'VUV', label: 'バツ' },
  { code: 'WST', label: 'タラ' },
  { code: 'XAF', label: '中央アフリカCFAフラン' },
  { code: 'XAG', label: '銀（1トロイオンス）' },
  { code: 'XAU', label: '金（1トロイオンス）' },
  { code: 'XBA', label: '欧州複合単位 (EURCO) （債券市場単位）' },
  { code: 'XBB', label: '欧州通貨単位 (E.M.U.-6) （債券市場単位）' },
  { code: 'XBC', label: '欧州計算単位9 (E.U.A.-9) （債券市場単位）' },
  { code: 'XBD', label: '欧州計算単位17 (E.U.A.-17) （債券市場単位）' },
  { code: 'XCD', label: '東カリブ・ドル' },
  { code: 'XDR', label: '特別引出権' },
  { code: 'XOF', label: '西アフリカCFAフラン' },
  { code: 'XPD', label: 'パラジウム（1トロイオンス）' },
  { code: 'XPF', label: 'CFPフラン（太平洋フラン）' },
  { code: 'XPT', label: '白金（1トロイオンス）' },
  { code: 'XSU', label: 'SUCRE' },
  { code: 'XUA', label: 'ADB計算単位' },
  { code: 'YER', label: 'イエメン・リアル' },
  { code: 'ZAR', label: 'ランド' },
  { code: 'ZMW', label: 'ザンビア・クワチャ' },
  { code: 'ZWL', label: 'ジンバブエ・ドル' },
]

export const CurrencyEditor: React.FC<CurrencyEditorProps> = ({
  setCurrencies,
  currencies,
}) => {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => e.preventDefault(),
    [],
  )

  const onCurrencySymbolChange = useCallback((i: number, v: string | null) => {
    setCurrencies((c) => spliceToNew(c, i, 1, { ...c[i], symbol: v ?? 'USD' }))
  }, [])

  const onCurrencyRateChange = useCallback(
    (i: number, v: number | undefined) => {
      setCurrencies((c) => spliceToNew(c, i, 1, { ...c[i], rate: v ?? 1 }))
    },
    [],
  )

  const onCurrencyRemoveClick = useCallback((i: number) => {
    setCurrencies((c) => spliceToNew(c, i, 1))
  }, [])

  const onCurrencyAddClick = useCallback(() => {
    setCurrencies((c) => [...c, { symbol: 'USD', rate: 1 }])
  }, [])

  const onCurrencyInputKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return

      e.preventDefault()
      onCurrencyAddClick()
    },
    [],
  )

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        {currencies.map((c, i) => (
          <Group key={`currency-${i}`}>
            1
            <Select
              data={currencyData.map((c) => ({
                value: c.code,
                label: `${c.code} (${c.label})`,
              }))}
              searchable
              value={c.symbol}
              onChange={(e) => onCurrencySymbolChange(i, e)}
              onKeyUp={onCurrencyInputKeyUp}
            />
            =
            <Input
              value={c.rate}
              type="number"
              onChange={(e) =>
                onCurrencyRateChange(i, Number(e.currentTarget.value))
              }
              onKeyUp={onCurrencyInputKeyUp}
            />
            JPY
            <Button onClick={() => onCurrencyRemoveClick(i)}>×</Button>
          </Group>
        ))}
        <Button onClick={onCurrencyAddClick}>＋</Button>
      </Stack>
    </form>
  )
}
