import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Flex } from "antd";

export const OnChainTag = ({ isValid }: { isValid: boolean }) => {
  return (
    <Flex align="center" gap={8}>
      {isValid ? (
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      ) : (
        <CloseCircleTwoTone twoToneColor="red" />
      )}
      <span>{isValid ? "Đồng bộ" : "Không đồng bộ"}</span>
    </Flex>
  );
};
