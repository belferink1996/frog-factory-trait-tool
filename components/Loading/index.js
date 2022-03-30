import Modal from '../Modal'
import Loader from './Loader'

const Loading = ({ open }) => {
  return (
    <Modal open={open} transparent>
      <Loader />
    </Modal>
  )
}

export default Loading
