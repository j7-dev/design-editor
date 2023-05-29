import React from "react"
import { styled, ThemeProvider, DarkTheme } from "baseui"
import { Theme } from "baseui/theme"
import { Button, KIND } from "baseui/button"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"
import useEditorType from "~/hooks/useEditorType"
import { IScene } from "@layerhub-io/types"
import { loadTemplateFonts } from "~/utils/fonts"
import { loadVideoEditorAssets } from "~/utils/video"
import DesignTitle from "./DesignTitle"
import { IDesign } from "~/interfaces/DesignEditor"
import Github from "~/components/Icons/Github"
import { BsWordpress } from "react-icons/bs"
import { StatefulTooltip } from "baseui/tooltip"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  height: "64px",
  background: $theme.colors.black,
  display: "grid",
  padding: "0 1.25rem",
  gridTemplateColumns: "380px 1fr 380px",
  alignItems: "center",
}))

const Navbar = () => {
  const { setScenes, setCurrentDesign, currentDesign, scenes } = useDesignEditorContext()
  const editorType = useEditorType("GRAPHIC")
  const editor = useEditor()
  console.log("🚀 ~ file: Navbar.tsx:31 ~ Navbar ~ editorType:", editorType)
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON()

    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        }
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      }
    })

    if (currentDesign) {
      const graphicTemplate: IDesign = {
        id: currentDesign.id,
        type: "GRAPHIC",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }
      makeDownload(graphicTemplate)
    } else {
      console.log("NO CURRENT DESIGN")
    }
  }

  const parsePresentationJSON = () => {
    const currentScene = editor.scene.exportToJSON()

    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          duration: 5000,
          layers: currentScene.layers,
          name: currentScene.name,
        }
      }
      return {
        id: scn.id,
        duration: 5000,
        layers: scn.layers,
        name: scn.name,
      }
    })

    if (currentDesign) {
      const presentationTemplate: IDesign = {
        id: currentDesign.id,
        type: "PRESENTATION",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }
      makeDownload(presentationTemplate)
    } else {
      console.log("NO CURRENT DESIGN")
    }
  }

  const parseVideoJSON = () => {
    const currentScene = editor.scene.exportToJSON()
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: scn.id,
          duration: scn.duration,
          layers: currentScene.layers,
          name: currentScene.name ? currentScene.name : "",
        }
      }
      return {
        id: scn.id,
        duration: scn.duration,
        layers: scn.layers,
        name: scn.name ? scn.name : "",
      }
    })
    if (currentDesign) {
      const videoTemplate: IDesign = {
        id: currentDesign.id,
        type: "VIDEO",
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      }
      makeDownload(videoTemplate)
    } else {
      console.log("NO CURRENT DESIGN")
    }
  }

  const makeDownload = (data: Object) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
    const a = document.createElement("a")
    a.href = dataStr
    a.download = "template.json"
    a.click()
  }

  const makeDownloadTemplate = async () => {
    // NOTE - 這個JSON匯出沒什麼用 可能可以用來儲存
    if (editor) {
      if (editorType === "GRAPHIC") {
        return parseGraphicJSON()
      } else if (editorType === "PRESENTATION") {
        return parsePresentationJSON()
      } else {
        return parseVideoJSON()
      }
    }
  }

  const handleDownload = () => {
    // TODO 需要實作CANVAS DOWNLOAD
  }

  return (
    // @ts-ignore
    <ThemeProvider theme={DarkTheme}>
      <Container>
        <StatefulTooltip content="Back to WordPress Admin" placement="right" showArrow returnFocus triggerType="hover">
          <a href="#" style={{ width: "36px", height: "36px", display: "block" }}>
            <BsWordpress size={36} style={{ cursor: "pointer", color: "#fff" }} />
          </a>
        </StatefulTooltip>

        <DesignTitle />
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Button
            size="compact"
            onClick={handleDownload}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Download
          </Button>

          <a href="https://github.com/j7-dev/design-editor" target="_blank">
            <Button size="compact" kind={KIND.tertiary}>
              <Github size={24} />
            </Button>
          </a>
        </Block>
      </Container>
    </ThemeProvider>
  )
}

export default Navbar
