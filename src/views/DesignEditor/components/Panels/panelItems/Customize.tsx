import React from "react"
import { Button, SIZE } from "baseui/button"
import { useStyletron } from "baseui"
import { HexColorPicker } from "react-colorful"
import { StatefulPopover, PLACEMENT } from "baseui/popover"
import { Plus } from "baseui/icon"
import { Input } from "baseui/input"
import { useEditor, useFrame } from "@layerhub-io/react"
import { Modal, ROLE } from "baseui/modal"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { sampleFrames } from "~/constants/editor"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
import SwapHorizontal from "~/components/Icons/SwapHorizontal"
import { Tabs, Tab } from "baseui/tabs"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { images } from "~/constants/mock-data"

const colors = ["#ffffff", "#9B9B9B", "#4A4A4A", "#000000", "#A70C2C", "#DA9A15", "#F8E71D", "#47821A", "#4990E2"]

interface State {
  backgroundColor: string
}

const Customize = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [state, setState] = React.useState<State>({
    backgroundColor: "#000000",
  })

  const changeBackgroundColor = (color: string) => {
    if (editor) {
      editor.frame.setBackgroundColor(color)
    }
  }

  const handleChange = (type: string, value: any) => {
    setState({ ...state, [type]: value })
    changeBackgroundColor(value)
  }

  const addObject = React.useCallback(
    (url: string) => {
      if (editor) {
        const options = {
          type: "StaticImage",
          src: url,
        }
        // editor.objects.add(options)
        editor.frame.background(options)
      }
    },
    [editor]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Customize</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          {/* <Block>
            <ResizeTemplate />
            <Block $style={{ fontSize: "14px", textAlign: "center", paddingTop: "0.35rem" }}>1080 x 1920px</Block>
          </Block> */}

          <Block paddingTop="0.5rem">
            <div
              style={{
                background: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #ececf5",
                padding: "0.45rem 1rem",
                fontSize: "14px",
              }}
            >
              <div>Background color</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  paddingTop: "0.25rem",
                }}
              >
                <StatefulPopover
                  placement={PLACEMENT.bottomLeft}
                  content={
                    <div
                      style={{
                        padding: "1rem",
                        background: "#ffffff",
                        width: "200px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <HexColorPicker onChange={(v) => handleChange("backgroundColor", v)} />
                      <Input
                        overrides={{ Input: { style: { textAlign: "center" } } }}
                        value={state.backgroundColor}
                        onChange={(e) => handleChange("backgroundColor", (e.target as any).value)}
                        placeholder="#000000"
                        clearOnEscape
                      />
                    </div>
                  }
                  accessibilityType="tooltip"
                >
                  <div>
                    <div
                      style={{
                        height: "40px",
                        width: "40px",
                        backgroundSize: "100% 100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundImage:
                          'url("https://static.canva.com/web/images/788ee7a68293bd0264fc31f22c31e62d.png")',
                      }}
                    >
                      <div
                        style={{
                          height: "32px",
                          width: "32px",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                        }}
                      >
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>
                </StatefulPopover>

                {colors.map((color) => (
                  <div
                    onClick={() => handleChange("backgroundColor", color)}
                    key={color}
                    style={{
                      background: color,
                      borderRadius: "4px",
                      border: "1px solid #d7d8e3",
                      height: "34px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </Block>
        </Block>
      </Scrollable>

      <Scrollable>
        <Block padding="0 1.5rem">
          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr" }}>
            {images.map((image, index) => {
              return <ImageItem key={index} onClick={() => addObject(image.src.large)} preview={image.src.small} />
            })}
          </div>
        </Block>
      </Scrollable>
    </Block>
  )
}

//TODO 之後要調尺寸可以做
const ResizeTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeKey, setActiveKey] = React.useState<string | number>("0")
  const { currentDesign, setCurrentDesign } = useDesignEditorContext()
  const editor = useEditor()
  const [desiredFrame, setDesiredFrame] = React.useState({
    width: 0,
    height: 0,
  })
  const [selectedFrame, setSelectedFrame] = React.useState<any>({
    id: 0,
    width: 0,
    height: 0,
  })
  const frame = useFrame()

  React.useEffect(() => {
    if (frame) {
      setDesiredFrame({
        width: frame.width,
        height: frame.height,
      })
    }
  }, [frame])

  const applyResize = () => {
    // @ts-ignore
    const size = activeKey === "0" ? selectedFrame : desiredFrame
    if (editor) {
      editor.frame.resize({
        width: parseInt(size.width),
        height: parseInt(size.height),
      })
      setCurrentDesign({
        ...currentDesign,
        frame: {
          width: parseInt(size.width),
          height: parseInt(size.height),
        },
      })
    }
    setIsOpen(false)
  }
  const isEnabled =
    // @ts-ignore
    (activeKey === "0" && selectedFrame.id !== 0) ||
    // @ts-ignore
    (activeKey === "1" && !!parseInt(desiredFrame.width) && !!parseInt(desiredFrame.height))

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size={SIZE.compact}
        overrides={{
          Root: {
            style: {
              width: "100%",
            },
          },
        }}
      >
        Resize template
      </Button>
      <Modal
        onClose={() => setIsOpen(false)}
        closeable={true}
        isOpen={isOpen}
        animate
        autoFocus
        size="auto"
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: {
              borderTopRightRadius: "8px",
              borderEndStartRadius: "8px",
              borderEndEndRadius: "8px",
              borderStartEndRadius: "8px",
              borderStartStartRadius: "8px",
            },
          },
        }}
      >
        <Block $style={{ padding: "0 1.5rem", width: "640px" }}>
          <Block
            $style={{
              padding: "2rem 1rem 1rem",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Choose a format and resize your template.
          </Block>
          <Tabs
            overrides={{
              TabContent: {
                style: {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
              },
              TabBar: {
                style: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                },
              },
            }}
            activeKey={activeKey}
            onChange={({ activeKey }) => {
              setActiveKey(activeKey)
            }}
          >
            <Tab title="Preset size">
              <Block $style={{ width: "100%", height: "400px" }}>
                <Scrollbar>
                  <Block $style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {sampleFrames.map((sampleFrame, index) => (
                      <Block
                        onClick={() => setSelectedFrame(sampleFrame)}
                        $style={{
                          padding: "0.5rem",
                          backgroundColor: selectedFrame.id === sampleFrame.id ? "rgb(243,244,245)" : "#ffffff",
                          ":hover": {
                            backgroundColor: "rgb(246,247,248)",
                            cursor: "pointer",
                          },
                        }}
                        key={index}
                      >
                        <Block
                          $style={{
                            height: "120px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src={sampleFrame.preview} />
                        </Block>
                        <Block $style={{ fontSize: "13px", textAlign: "center" }}>
                          <Block $style={{ fontWeight: 500 }}>{sampleFrame.name}</Block>
                          <Block $style={{ color: "rgb(119,119,119)" }}>
                            {sampleFrame.width} x {sampleFrame.height}px
                          </Block>
                        </Block>
                      </Block>
                    ))}
                  </Block>
                </Scrollbar>
              </Block>
            </Tab>
            <Tab title="Custom size">
              <Block $style={{ padding: "2rem 2rem" }}>
                <Block
                  $style={{ display: "grid", gridTemplateColumns: "1fr 50px 1fr", alignItems: "end", fontSize: "14px" }}
                >
                  <Input
                    onChange={(e: any) => setDesiredFrame({ ...desiredFrame, width: e.target.value })}
                    value={desiredFrame.width}
                    startEnhancer="W"
                    size={SIZE.compact}
                  />
                  <Button
                    overrides={{
                      Root: {
                        style: {
                          height: "32px",
                        },
                      },
                    }}
                    size={SIZE.compact}
                    kind="tertiary"
                  >
                    <SwapHorizontal size={24} />
                  </Button>
                  <Input
                    onChange={(e: any) => setDesiredFrame({ ...desiredFrame, height: e.target.value })}
                    value={desiredFrame.height}
                    startEnhancer="H"
                    size={SIZE.compact}
                  />
                </Block>
              </Block>
            </Tab>
          </Tabs>
        </Block>
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "2rem" }}>
          <Button disabled={!isEnabled} onClick={applyResize} style={{ width: "190px" }}>
            Resize template
          </Button>
        </Block>
      </Modal>
    </>
  )
}

const ImageItem = ({ preview, onClick }: { preview: any; onClick?: (option: any) => void }) => {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}
    >
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}
      />
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}

export default Customize
