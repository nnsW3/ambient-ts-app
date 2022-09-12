import styles from './ConfirmLimitModal.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import WaitingConfirmation from '../../../Global/WaitingConfirmation/WaitingConfirmation';
import TransactionSubmitted from '../../../Global/TransactionSubmitted/TransactionSubmitted';
import Button from '../../../Global/Button/Button';
import { TokenPairIF } from '../../../../utils/interfaces/exports';
import TransactionDenied from '../../../Global/TransactionDenied/TransactionDenied';
// import DenominationSwitch from '../../../Swap/DenominationSwitch/DenominationSwitch';
import TokensArrow from '../../../Global/TokensArrow/TokensArrow';
import { useAppSelector } from '../../../../utils/hooks/reduxToolkit';

interface ConfirmLimitModalProps {
    onClose: () => void;
    initiateLimitOrderMethod: () => void;
    tokenPair: TokenPairIF;
    poolPriceDisplay: number;
    tokenAInputQty: string;
    tokenBInputQty: string;
    isTokenAPrimary: boolean;
    // limitRate: string;
    insideTickDisplayPrice: number;
    newLimitOrderTransactionHash: string;
    txErrorCode: number;
    txErrorMessage: string;
    showConfirmation: boolean;
    setShowConfirmation: Dispatch<SetStateAction<boolean>>;
    resetConfirmation: () => void;
}

export default function ConfirmLimitModal(props: ConfirmLimitModalProps) {
    const {
        // onClose,
        tokenPair,
        poolPriceDisplay,
        initiateLimitOrderMethod,
        // limitRate,
        insideTickDisplayPrice,
        newLimitOrderTransactionHash,
        txErrorCode,
        txErrorMessage,
        resetConfirmation,
    } = props;
    const [confirmDetails, setConfirmDetails] = useState<boolean>(true);
    const [transactionApproved, setTransactionApproved] = useState<boolean>(false);

    useEffect(() => {
        if (newLimitOrderTransactionHash) {
            setTransactionApproved(true);
        }
    }, [newLimitOrderTransactionHash]);

    const tradeData = useAppSelector((state) => state.tradeData);

    const isDenomBase = tradeData.isDenomBase;
    const baseTokenSymbol = tradeData.baseToken.symbol;
    const quoteTokenSymbol = tradeData.quoteToken.symbol;

    const displayPoolPriceWithDenom = isDenomBase ? 1 / poolPriceDisplay : poolPriceDisplay;

    const displayPoolPriceString =
        displayPoolPriceWithDenom === Infinity || displayPoolPriceWithDenom === 0
            ? '…'
            : displayPoolPriceWithDenom < 2
            ? displayPoolPriceWithDenom.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
              })
            : displayPoolPriceWithDenom.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });

    const trunctatedInsideTickDisplayPrice =
        insideTickDisplayPrice < 2
            ? insideTickDisplayPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
              })
            : insideTickDisplayPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });

    const isTransactionDenied =
        txErrorCode === 4001 &&
        txErrorMessage === 'MetaMask Tx Signature: User denied transaction signature.';
    const sellTokenQty = (document.getElementById('sell-limit-quantity') as HTMLInputElement)
        ?.value;
    const buyTokenQty = (document.getElementById('buy-limit-quantity') as HTMLInputElement)?.value;

    const sellTokenData = tokenPair.dataTokenA;

    const buyTokenData = tokenPair.dataTokenB;

    const moreExpensiveToken = 'ETH';
    // const lessExpensiveToken = 'DAI';

    // const displayConversionRate = parseFloat(buyTokenQty) / parseFloat(sellTokenQty);
    // // const priceLimit = 0.12;

    // const displayPriceWithDenom = isDenomBase ? displayConversionRate : 1 / displayConversionRate;

    // const displayPriceString =
    //     displayPriceWithDenom === Infinity || displayPriceWithDenom === 0
    //         ? '…'
    //         : displayPriceWithDenom < 2
    //         ? displayPriceWithDenom.toLocaleString(undefined, {
    //               minimumFractionDigits: 2,
    //               maximumFractionDigits: 6,
    //           })
    //         : displayPriceWithDenom.toLocaleString(undefined, {
    //               minimumFractionDigits: 2,
    //               maximumFractionDigits: 2,
    //           });

    const explanationText = (
        <div className={styles.confSwap_detail_note}>any other explanation text will go here.</div>
    );

    // console.log(sellTokenData);
    const buyCurrencyRow = (
        <div className={styles.currency_row_container}>
            <h2>{buyTokenQty}</h2>

            <div className={styles.logo_display}>
                <img src={buyTokenData.logoURI} alt={buyTokenData.symbol} />
                <h2>{buyTokenData.symbol}</h2>
            </div>
        </div>
    );
    const sellCurrencyRow = (
        <div className={styles.currency_row_container}>
            <h2>{sellTokenQty}</h2>

            <div className={styles.logo_display}>
                <img src={sellTokenData.logoURI} alt={sellTokenData.symbol} />
                <h2>{sellTokenData.symbol}</h2>
            </div>
        </div>
    );

    const limitRateRow = (
        <div className={styles.limit_row_container}>
            <h2>@ {trunctatedInsideTickDisplayPrice}</h2>
        </div>
    );

    const extraInfoData = (
        <div className={styles.extra_info_container}>
            <div className={styles.convRate}>
                {isDenomBase
                    ? `${trunctatedInsideTickDisplayPrice} ${quoteTokenSymbol} per ${baseTokenSymbol}`
                    : `${trunctatedInsideTickDisplayPrice} ${baseTokenSymbol} per ${quoteTokenSymbol}`}
            </div>
            <div className={styles.row}>
                <p>Current Price</p>
                <p>
                    {isDenomBase
                        ? `${displayPoolPriceString} ${quoteTokenSymbol} per ${baseTokenSymbol}`
                        : `${displayPoolPriceString} ${baseTokenSymbol} per ${quoteTokenSymbol}`}
                </p>
            </div>
            <div className={styles.row}>
                <p>Fill Start</p>
                <p>0.000043 {moreExpensiveToken} </p>
            </div>
            <div className={styles.row}>
                <p>Fill End</p>
                <p>0.000043 {moreExpensiveToken} </p>
            </div>
        </div>
    );

    const fullTxDetails = (
        <div className={styles.main_container}>
            <section>
                {limitRateRow}
                {sellCurrencyRow}
                <div className={styles.arrow_container}>
                    <TokensArrow />
                </div>
                {buyCurrencyRow}
            </section>
            {/* <DenominationSwitch /> */}
            {extraInfoData}
            {explanationText}
        </div>
    );

    // REGULAR CONFIRMATION MESSAGE STARTS HERE
    // const currentTxHash = 'i am hash number';
    const confirmSendMessage = (
        <WaitingConfirmation
            content={` Swapping ${sellTokenQty} ${sellTokenData.symbol} for ${buyTokenQty} ${buyTokenData.symbol}`}
        />
    );

    const transactionDenied = <TransactionDenied resetConfirmation={resetConfirmation} />;

    const transactionSubmitted = (
        <TransactionSubmitted
            hash={newLimitOrderTransactionHash}
            tokenBSymbol={buyTokenData.symbol}
            tokenBAddress={buyTokenData.address}
            tokenBDecimals={buyTokenData.decimals}
            tokenBImage={buyTokenData.logoURI}
        />
    );

    const confirmationDisplay = isTransactionDenied
        ? transactionDenied
        : transactionApproved
        ? transactionSubmitted
        : confirmSendMessage;

    const confirmLimitButton = (
        <Button
            title='Send Limit to Metamask'
            action={() => {
                // console.log(
                //     `Sell Token Full name: ${sellTokenData.symbol} and quantity: ${sellTokenQty}`,
                // );
                // console.log(
                //     `Buy Token Full name: ${buyTokenData.symbol} and quantity: ${buyTokenQty}`,
                // );
                initiateLimitOrderMethod();

                setConfirmDetails(false);
            }}
        />
    );

    const modal = (
        <div className={styles.modal_container}>
            <section className={styles.modal_content}>
                {confirmDetails ? fullTxDetails : confirmationDisplay}
            </section>
            <footer className={styles.modal_footer}>
                {confirmDetails ? confirmLimitButton : null}
            </footer>
        </div>
    );

    return <>{modal}</>;
}
