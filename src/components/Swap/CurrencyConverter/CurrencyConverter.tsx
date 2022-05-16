import { useState, ChangeEvent } from 'react';
import styles from './CurrencyConverter.module.css';
import CurrencySelector from '../CurrencySelector/CurrencySelector';

interface CurrencyConverterProps {
    isLiq: boolean;
    poolPrice: number;
}

export default function CurrencyConverter(
    props: CurrencyConverterProps,
): React.ReactElement<CurrencyConverterProps> {
    const { isLiq, poolPrice } = props;

    const [sellTokenQty, setSellTokenQty] = useState<number>(0);
    const [buyTokenQty, setBuyTokenQty] = useState<number>(0);

    const updateBuyQty = (evt: ChangeEvent<HTMLInputElement>) => {
        console.log('fired function updateBuyQty');
        const input = parseFloat(evt.target.value);
        const output = (1 / poolPrice) * input;
        return output;
    };

    const updateSellQty = (evt: ChangeEvent<HTMLInputElement>) => {
        console.log('fired function updateSellQty');
        const input = parseFloat(evt.target.value);
        const output = poolPrice * input;
        return output;
    };

    return (
        <section className={styles.currency_converter}>
            <CurrencySelector
                direction={isLiq ? 'Select Pair' : 'From:'}
                fieldId='sell'
                sellToken
                buyTokenQty={buyTokenQty}
                sellTokenQty={sellTokenQty}
                updateTokenQuantity={setSellTokenQty}
                updateOtherQuantity={updateBuyQty}
            />
            <div className={styles.arrow_container}>
                {isLiq ? null : <span className={styles.arrow} />}
            </div>
            <CurrencySelector
                direction={isLiq ? '' : 'To:'}
                fieldId='buy'
                buyTokenQty={buyTokenQty}
                sellTokenQty={sellTokenQty}
                updateTokenQuantity={setBuyTokenQty}
                updateOtherQuantity={updateSellQty}
            />
        </section>
    );
}
