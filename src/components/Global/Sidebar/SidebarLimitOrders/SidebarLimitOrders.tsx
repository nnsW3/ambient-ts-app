import SidebarLimitOrdersCard from './SidebarLimitOrdersCard';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LimitOrderIF } from '../../../../ambient-utils/types';
import { CrocEnvContext } from '../../../../contexts/CrocEnvContext';
import { SidebarContext } from '../../../../contexts/SidebarContext';
import { TradeTableContext } from '../../../../contexts/TradeTableContext';
import {
    limitParamsIF,
    linkGenMethodsIF,
    useLinkGen,
} from '../../../../utils/hooks/useLinkGen';
import { FlexContainer } from '../../../../styled/Common';
import {
    HeaderGrid,
    ItemsContainer,
    ViewMoreFlex,
} from '../../../../styled/Components/Sidebar';
import { UserDataContext } from '../../../../contexts/UserDataContext';

interface propsIF {
    limitOrderByUser?: LimitOrderIF[];
}

export default function SidebarLimitOrders(props: propsIF) {
    const { limitOrderByUser } = props;

    const { isUserConnected } = useContext(UserDataContext);

    const {
        chainData: { chainId },
    } = useContext(CrocEnvContext);
    const {
        setCurrentPositionActive,
        setShowAllData,
        setOutsideControl,
        setSelectedOutsideTab,
    } = useContext(TradeTableContext);
    const {
        sidebar: { close: closeSidebar },
    } = useContext(SidebarContext);

    const location = useLocation();

    // hooks to generate navigation actions with pre-loaded paths
    const linkGenLimit: linkGenMethodsIF = useLinkGen('limit');
    const linkGenAccount: linkGenMethodsIF = useLinkGen('account');

    const onTradeRoute = location.pathname.includes('trade');
    const onAccountRoute = location.pathname.includes('account');

    const tabToSwitchToBasedOnRoute = onTradeRoute ? 1 : onAccountRoute ? 1 : 1;
    function redirectBasedOnRoute() {
        if (onAccountRoute) return;
        linkGenAccount.navigate();
    }

    const handleLimitOrderClick = (limitOrder: LimitOrderIF) => {
        setOutsideControl(true);
        setSelectedOutsideTab(1);
        setCurrentPositionActive(limitOrder.limitOrderId);
        setShowAllData(false);
        const { base, quote, isBid, bidTick, askTick } = limitOrder;
        // URL params for link to limit page
        const limitLinkParams: limitParamsIF = {
            chain: chainId,
            tokenA: base,
            tokenB: quote,
            limitTick: isBid ? bidTick : askTick,
        };
        // navigate user to limit page with URL params defined above
        linkGenLimit.navigate(limitLinkParams);
    };

    const handleViewMoreClick = () => {
        redirectBasedOnRoute();
        setOutsideControl(true);
        setSelectedOutsideTab(tabToSwitchToBasedOnRoute);
        closeSidebar();
    };

    return (
        <FlexContainer flexDirection='column' fontSize='body' fullHeight>
            <HeaderGrid numCols={3} color='text2' padding='4px 0'>
                {['Pool', 'Price', 'Value'].map((item) => (
                    <FlexContainer key={item} justifyContent='center'>
                        {item}
                    </FlexContainer>
                ))}
            </HeaderGrid>
            <ItemsContainer>
                {limitOrderByUser &&
                    limitOrderByUser.map((order: LimitOrderIF) => (
                        <SidebarLimitOrdersCard
                            key={
                                'Sidebar-Limit-Orders-Card-' +
                                JSON.stringify(order)
                            }
                            order={order}
                            handleClick={handleLimitOrderClick}
                        />
                    ))}
                {isUserConnected && (
                    <ViewMoreFlex
                        justifyContent='center'
                        color='accent4'
                        onClick={handleViewMoreClick}
                    >
                        View More
                    </ViewMoreFlex>
                )}
            </ItemsContainer>
        </FlexContainer>
    );
}
