import useEditorType from "~/hooks/useEditorType"
import SelectEditor from "./SelectEditor"
import GraphicEditor from "./GraphicEditor"
import PresentationEditor from "./PresentationEditor"
import VideoEditor from "./VideoEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"
import ContextMenu from "./components/ContextMenu"

const DesignEditor = () => {
  const editorType = useEditorType()

  return <GraphicEditor />

  // TODO: delete
  // return (
  //   <>
  //     {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}
  //     {
  //       {
  //         NONE: <SelectEditor />,
  //         PRESENTATION: <PresentationEditor />,
  //         VIDEO: <VideoEditor />,
  //         GRAPHIC: <GraphicEditor />,
  //       }[editorType]
  //     }
  //   </>
  // )
}

export default DesignEditor
