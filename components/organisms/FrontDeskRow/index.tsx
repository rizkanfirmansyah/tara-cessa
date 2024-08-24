import { Button } from '@/components';
import { OrderType } from '@/types';
import { RoomManageType } from '@/types/RoomType';
import { faEye, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface FrontDeskRowProps {
  index: number;
  frontdesk: RoomManageType;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onDetail?: () => void;
}

const FrontDeskRow = ({ index, frontdesk, onCheckIn, onCheckOut, onDetail }: FrontDeskRowProps) => {
  return (
    <tr className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-semi-light dark:hover:bg-gray-700 px-4 hover:text-dark rounded transition-all duration-300 `}>
      <td className="py-2 w-[1px]">{index}</td>
      <td className="py-2 ">{frontdesk.no}</td>
      <td className="py-2 ">
        {frontdesk.guestPhoto && (
          <Image priority src={`${process.env.NEXT_PUBLIC_URL}/files/${frontdesk.guestPhoto}`} alt={`Image ${frontdesk.guestName}`} className="mr-2 w-12 object-cover" width={100} height={100} />
        )}
        <p>{frontdesk.guestName}</p>
      </td>
      <td className="py-2 ">{frontdesk.sender}</td>
      <td className="py-2 ">{frontdesk.senderPosition}</td>
      <td className="py-2 ">{frontdesk.greetings}</td>
      <td className="py-2 ">
        {frontdesk.checkInTime ? (
          <Button theme='secondary' className='cursor-not-allowed'>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        ) : (
          <Button theme='success' onClick={onCheckIn}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}
      </td>
      <td className="py-2 ">
        {frontdesk.checkInTime ? (
          <Button theme='danger' onClick={onCheckOut}>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        ) : (
          <Button theme='secondary' className='cursor-not-allowed'>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        )}
      </td>
      <td className="py-2 ">
        <Button theme='warning' onClick={onDetail}>
          <FontAwesomeIcon icon={faEye} />
        </Button>
      </td>
    </tr>
  )
}

export default FrontDeskRow