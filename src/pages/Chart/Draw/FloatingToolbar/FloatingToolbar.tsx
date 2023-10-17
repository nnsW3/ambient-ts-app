import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    FloatingButtonDiv,
    FloatingOptions,
    Divider,
    FloatingDivContainer,
    FloatingDiv,
    OptionsTab,
    HorizontalDivider,
    OptionsTabSize,
    OptionsTabStyle,
} from './FloatingToolbarCss';
import dragButton from '../../../../assets/images/icons/draw/floating_button.svg';
import {
    drawDataHistory,
    selectedDrawnData,
} from '../../ChartUtils/chartUtils';
import * as d3 from 'd3';
import { ChartContext } from '../../../../contexts/ChartContext';
import {
    AiOutlineDash,
    AiOutlineDelete,
    AiOutlineMinus,
    AiOutlineSmallDash,
} from 'react-icons/ai';
import { TbBrush } from 'react-icons/tb';

interface FloatingToolbarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mainCanvasBoundingClientRect: any;
    selectedDrawnShape: selectedDrawnData | undefined;
    setDrawnShapeHistory: React.Dispatch<
        React.SetStateAction<drawDataHistory[]>
    >;
    setSelectedDrawnShape: React.Dispatch<
        React.SetStateAction<selectedDrawnData | undefined>
    >;
    setIsShapeEdited: React.Dispatch<boolean>;
    deleteItem: (item: drawDataHistory) => void;
}
function FloatingToolbar(props: FloatingToolbarProps) {
    const {
        mainCanvasBoundingClientRect,
        selectedDrawnShape,
        setDrawnShapeHistory,
        setSelectedDrawnShape,
        deleteItem,
        setIsShapeEdited,
    } = props;
    const floatingDivRef = useRef<HTMLDivElement>(null);
    const { isFullScreen: fullScreenChart } = useContext(ChartContext);
    const [isDragging, setIsDragging] = useState(false);
    const [divLeft, setDivLeft] = useState(0);
    const [divTop, setDivTop] = useState(0);

    const [isStyleOptionTabActive, setIsStyleOptionTabActive] = useState(false);
    const [isSizeOptionTabActive, setIsSizeOptionTabActive] = useState(false);

    const handleEditColor = () => {
        if (selectedDrawnShape?.data) {
            setDrawnShapeHistory((item: drawDataHistory[]) => {
                const changedItemIndex = item.findIndex(
                    (i) => i.time === selectedDrawnShape?.data.time,
                );

                item[changedItemIndex].color = 'red';

                return item;
            });
            setIsShapeEdited(true);
        }
    };

    const handleEditSize = (value: number) => {
        if (selectedDrawnShape?.data) {
            setDrawnShapeHistory((item: drawDataHistory[]) => {
                const changedItemIndex = item.findIndex(
                    (i) => i.time === selectedDrawnShape?.data.time,
                );

                item[changedItemIndex].lineWidth = value;

                return item;
            });
            setIsShapeEdited(true);
        }
    };

    const handleEditStyle = (array: number[]) => {
        if (selectedDrawnShape?.data) {
            setDrawnShapeHistory((item: drawDataHistory[]) => {
                const changedItemIndex = item.findIndex(
                    (i) => i.time === selectedDrawnShape?.data.time,
                );

                item[changedItemIndex].style = array;

                return item;
            });
            setIsShapeEdited(true);
        }
    };

    const deleteDrawnShape = () => {
        if (selectedDrawnShape?.data) {
            deleteItem(selectedDrawnShape?.data);
            setDrawnShapeHistory((item: drawDataHistory[]) => {
                return item.filter(
                    (i) => i.time !== selectedDrawnShape?.data.time,
                );
            });
            setSelectedDrawnShape(undefined);
        }
    };

    const editShapeOptions = [
        {
            name: 'Color',
            type: 'color',
            operation: handleEditColor,
            icon: <TbBrush />,
        },
        {
            name: 'Size',
            type: 'size',
            operation: () => {
                setIsStyleOptionTabActive(false);
                setIsSizeOptionTabActive((prev) => !prev);
            },
            icon: <AiOutlineMinus color='white' />,
        },
        {
            name: 'Style',
            type: 'style',
            operation: () => {
                setIsSizeOptionTabActive(false);
                setIsStyleOptionTabActive((prev) => !prev);
            },
            icon: <AiOutlineDash color='white' />,
        },
        {
            name: 'Delete',
            type: 'delete',
            operation: deleteDrawnShape,
            icon: <AiOutlineDelete />,
        },
    ];

    const sizeOptions = [
        {
            name: '1px',
            value: 1,
            icon: (
                <AiOutlineMinus color='white' width={'1px'} height={'15px'} />
            ),
        },
        {
            name: '2px',
            value: 2,
            icon: <AiOutlineMinus color='white' />,
        },
        {
            name: '3px',
            value: 3,
            icon: <AiOutlineMinus color='white' />,
        },
        {
            name: '4px',
            value: 4,
            icon: <AiOutlineMinus color='white' />,
        },
    ];

    const styleOptions = [
        {
            name: 'Line',
            value: [0, 0],
            icon: <AiOutlineMinus color='white' />,
        },
        {
            name: 'Dashed',
            value: [5, 5],
            icon: <AiOutlineDash color='white' />,
        },
        {
            name: 'Dotted',
            value: [3, 6],
            icon: <AiOutlineSmallDash color='white' />,
        },
    ];

    useEffect(() => {
        const floatingDiv = d3
            .select(floatingDivRef.current)
            .node() as HTMLDivElement;

        let offsetX = 0;
        let offsetY = 0;
        if (floatingDiv) {
            const floatingDivDrag = d3
                .drag<d3.DraggedElementBaseType, unknown, d3.SubjectPosition>()
                .on('start', function (event) {
                    offsetX =
                        event.sourceEvent.clientX -
                        floatingDiv.getBoundingClientRect().left;
                    offsetY =
                        event.sourceEvent.clientY -
                        floatingDiv.getBoundingClientRect().top;
                })
                .on('drag', function (event) {
                    if (floatingDivRef.current) {
                        setIsDragging(true);
                        const divLeft = event.sourceEvent.pageX - offsetX;
                        const divTop = event.sourceEvent.pageY - offsetY;
                        setDivLeft(divLeft);
                        setDivTop(divTop);
                    }
                });

            if (floatingDivRef.current) {
                d3.select<d3.DraggedElementBaseType, unknown>(
                    floatingDivRef.current,
                ).call(floatingDivDrag);
            }
        }
    }, [floatingDivRef, selectedDrawnShape]);

    useEffect(() => {
        if (floatingDivRef.current && !isDragging) {
            const floatingDiv = d3
                .select(floatingDivRef.current)
                .node() as HTMLDivElement;

            setDivLeft(mainCanvasBoundingClientRect?.width);
            setDivTop(
                mainCanvasBoundingClientRect?.top -
                    (floatingDiv.getBoundingClientRect().height + 10),
            );
        }
    }, [
        floatingDivRef.current === null,
        mainCanvasBoundingClientRect,
        fullScreenChart,
    ]);

    return (
        <FloatingDivContainer
            ref={floatingDivRef}
            style={{
                left: divLeft + 'px',
                top: divTop + 'px',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                visibility:
                    selectedDrawnShape !== undefined && divLeft && divTop
                        ? 'visible'
                        : 'hidden',
            }}
        >
            <FloatingDiv>
                <FloatingButtonDiv>
                    <img src={dragButton} alt='' />
                    <Divider></Divider>
                </FloatingButtonDiv>

                {editShapeOptions.map((item, index) => (
                    <FloatingOptions key={index} onClick={item.operation}>
                        {item.icon}
                    </FloatingOptions>
                ))}
            </FloatingDiv>

            {isSizeOptionTabActive && (
                <OptionsTab
                    style={{
                        marginLeft: '70px',
                    }}
                >
                    {sizeOptions.map((item, index) => (
                        <OptionsTabSize
                            key={index}
                            onClick={() => handleEditSize(item.value)}
                        >
                            {item.icon} {item.name}
                            {/* <HorizontalDivider></HorizontalDivider> */}
                        </OptionsTabSize>
                    ))}
                </OptionsTab>
            )}

            {isStyleOptionTabActive && (
                <OptionsTab
                    style={{
                        marginLeft: '70px',
                    }}
                >
                    {styleOptions.map((item, index) => (
                        <OptionsTabStyle
                            key={index}
                            onClick={() => handleEditStyle(item.value)}
                        >
                            {item.icon} {item.name}
                            {/* <HorizontalDivider></HorizontalDivider> */}
                        </OptionsTabStyle>
                    ))}
                </OptionsTab>
            )}
        </FloatingDivContainer>
    );
}

export default FloatingToolbar;
